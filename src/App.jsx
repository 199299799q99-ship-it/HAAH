import { useState, useEffect } from 'react'
import { 
  Layout, 
  Typography, 
  Input, 
  Button, 
  Card, 
  Empty, 
  Space, 
  Popconfirm, 
  message, 
  FloatButton,
  Modal,
  Badge,
  Tooltip,
  ConfigProvider,
  theme,
  Segmented
} from 'antd'
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  SearchOutlined,
  BookOutlined,
  CalendarOutlined,
  BulbOutlined,
  BulbFilled,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons'
import './App.css'

const { Header, Content } = Layout
const { Title, Paragraph } = Typography
const { TextArea } = Input

function App() {
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode')
    return savedMode || 'light'
  })
  
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode)
    document.body.classList.remove('dark-mode', 'pink-mode')
    if (themeMode === 'dark') {
      document.body.classList.add('dark-mode')
    } else if (themeMode === 'pink') {
      document.body.classList.add('pink-mode')
    }
  }, [themeMode])

  const handleSave = () => {
    if (!currentNote.title.trim() && !currentNote.content.trim()) {
      message.warning('请输入标题或内容')
      return
    }

    if (editId) {
      setNotes(notes.map(note => 
        note.id === editId ? { ...currentNote, id: editId, date: new Date().toLocaleString() } : note
      ))
      message.success('更新成功')
    } else {
      setNotes([{ ...currentNote, id: Date.now(), date: new Date().toLocaleString() }, ...notes])
      message.success('保存成功')
    }
    closeModal()
  }

  const openModal = (note = null) => {
    if (note) {
      setCurrentNote({ title: note.title, content: note.content })
      setEditId(note.id)
    } else {
      setCurrentNote({ title: '', content: '' })
      setEditId(null)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentNote({ title: '', content: '' })
    setEditId(null)
  }

  const handleDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id))
    message.success('已删除')
  }

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getThemeConfig = () => {
    if (themeMode === 'dark') {
      return {
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }
    }
    if (themeMode === 'pink') {
      return {
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#eb2f96',
          borderRadius: 8,
          colorBgLayout: '#fff0f6',
          colorBgContainer: '#ffffff',
        },
      }
    }
    return {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 8,
      },
    }
  }

  return (
    <ConfigProvider theme={getThemeConfig()}>
      <Layout className={`app-layout ${themeMode}`}>
        <Header className="app-header">
          <div className="header-left">
            <div className="header-logo">
            <div className="logo-3d-container">
              <BookOutlined className="logo-icon" />
            </div>
            <Title level={3} className="logo-text">NoteFlow</Title>
          </div>
          </div>
          
          <div className="header-center">
            <Input 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="搜索你的灵感..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="search-input"
            />
          </div>

          <div className="header-right">
            <Space size="middle">
              <Segmented
                value={themeMode}
                onChange={(value) => setThemeMode(value)}
                options={[
                  { value: 'light', icon: <BulbOutlined /> },
                  { value: 'dark', icon: <BulbFilled /> },
                  { value: 'pink', icon: <HeartFilled style={{ color: '#eb2f96' }} /> },
                ]}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => openModal()}
                shape="round"
              >
                新建
              </Button>
            </Space>
          </div>
        </Header>

        <Content className="app-content">
          <div className="content-container">
            <div className="section-header">
              <Space align="baseline">
                <Title level={4}>所有笔记</Title>
                <Badge count={filteredNotes.length} color={themeMode === 'pink' ? '#eb2f96' : '#1677ff'} />
              </Space>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="empty-state">
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description={searchTerm ? "未找到相关笔记" : "还没有笔记，点击右上角新建一个吧"} 
                />
              </div>
            ) : (
              <div className="notes-grid">
                {filteredNotes.map(note => (
                  <Card 
                    key={note.id}
                    hoverable
                    className="note-card"
                    actions={[
                      <Tooltip title="编辑" key="edit">
                        <EditOutlined onClick={() => openModal(note)} />
                      </Tooltip>,
                      <Popconfirm
                        key="delete"
                        title="删除笔记"
                        description="确定要删除这条笔记吗？"
                        onConfirm={() => handleDelete(note.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Tooltip title="删除">
                          <DeleteOutlined style={{ color: '#ff4d4f' }} />
                        </Tooltip>
                      </Popconfirm>
                    ]}
                  >
                    <Card.Meta
                      title={<Title level={5} ellipsis={{ rows: 1 }} style={{ margin: 0 }}>{note.title || '无标题'}</Title>}
                      description={
                        <>
                          <div className="note-date">
                            <CalendarOutlined /> {note.date}
                          </div>
                          <Paragraph 
                            ellipsis={{ rows: 3 }} 
                            className="note-preview"
                          >
                            {note.content}
                          </Paragraph>
                        </>
                      }
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Content>

        <Modal
          title={editId ? "编辑笔记" : "新建笔记"}
          open={isModalOpen}
          onOk={handleSave}
          onCancel={closeModal}
          okText="保存"
          cancelText="取消"
          width={600}
          centered
          destroyOnHidden
        >
          <div className="modal-editor">
            <Input 
              placeholder="标题" 
              variant="borderless"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, padding: '8px 0' }}
            />
            <TextArea 
              placeholder="开始记录你的想法..." 
              variant="borderless"
              value={currentNote.content}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              autoSize={{ minRows: 10, maxRows: 20 }}
              style={{ padding: 0, fontSize: 16 }}
            />
          </div>
        </Modal>

        <FloatButton 
          icon={<PlusOutlined />} 
          type="primary" 
          style={{ right: 48, bottom: 48, width: 56, height: 56 }} 
          onClick={() => openModal()}
          tooltip={<div>新建笔记</div>}
        />
      </Layout>
    </ConfigProvider>
  )
}

export default App
