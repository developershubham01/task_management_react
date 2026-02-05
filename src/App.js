import React, { useState, useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { 
  Check, Edit2, Trash2, Plus, Filter, Search, Calendar, 
  Flag, TrendingUp, Clock, AlertCircle, Tag, X,
  CheckCircle, Circle, Loader, BarChart3, 
  Bell, Settings,  List, Grid, ChevronLeft,
  Menu, X as XIcon, ChevronUp
} from 'lucide-react';
import './App.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <ChevronUp size={24} />
    </button>
  );
};


const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle size={16} />;
      case 'medium': return <Flag size={16} />;
      case 'low': return <Flag size={16} />;
      default: return <Flag size={16} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="status-icon completed" />;
      case 'in-progress': return <Loader size={16} className="status-icon in-progress" />;
      default: return <Circle size={16} className="status-icon todo" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} animate-fade-in`}>
      <div className="task-header">
        <button 
          onClick={() => onToggleComplete(task.id)}
          className={`checkbox-btn ${task.completed ? 'checked' : ''}`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? <Check size={18} /> : null}
        </button>
        
        <div className="task-title-section">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-meta">
            <span className="task-date">
              <Calendar size={14} />
              {formatDate(task.dueDate)}
            </span>
            {task.dueSoon && (
              <span className="due-soon-indicator">
                <Clock size={14} />
                Due soon
              </span>
            )}
          </div>
        </div>
        
        <div className="task-actions">
          <button 
            onClick={() => onEdit(task)} 
            className="btn-edit"
            aria-label="Edit task"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(task.id)} 
            className="btn-delete"
            aria-label="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <div className="task-description">{task.description}</div>
      )}
      
      <div className="task-footer">
        <div className="task-tags">
          {task.tags && task.tags.map(tag => (
            <span key={tag} className="tag">
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="task-indicators">
          <span 
            className="task-priority"
            style={{ 
              backgroundColor: `${getPriorityColor(task.priority)}20`,
              color: getPriorityColor(task.priority),
              borderColor: `${getPriorityColor(task.priority)}40`
            }}
          >
            {getPriorityIcon(task.priority)}
            <span className="priority-text">{task.priority}</span>
          </span>
          
          <span className="task-status">
            {getStatusIcon(task.status)}
            <span className="status-text">{task.status}</span>
          </span>
        </div>
      </div>
    </div>
  );
};


const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(task || {
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    tags: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(e.target.value.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, e.target.value.trim()]
        });
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-overlay animate-fade-in">
      <div className="form-backdrop" onClick={onCancel}></div>
      <form onSubmit={handleSubmit} className="task-form animate-slide-up">
        <div className="form-header">
          <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>
          <button type="button" onClick={onCancel} className="close-btn" aria-label="Close">
            <XIcon size={24} />
          </button>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              <span className="label-text">
                Task Title *
              </span>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter task title"
                required
                className="form-input"
                autoFocus
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">
                Description
              </span>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your task..."
                rows="3"
                className="form-textarea"
              />
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">
                  <Flag size={16} />
                  Priority
                </span>
                <div className="select-wrapper">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="form-select"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">
                  <TrendingUp size={16} />
                  Status
                </span>
                <div className="select-wrapper">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">
                <Calendar size={16} />
                Due Date
              </span>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="form-input"
                min={today}
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">
                <Tag size={16} />
                Tags
              </span>
              <input
                type="text"
                placeholder="Type and press Enter to add tags"
                onKeyPress={handleTagInput}
                className="form-input"
              />
              <p className="input-hint">Press Enter to add a tag</p>
            </label>
            <div className="tags-container">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {task ? <><Check size={18} /> Update Task</> : <><Plus size={18} /> Add Task</>}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Statistics Component
const Statistics = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="statistics animate-fade-in">
      <div className="stat-card">
        <div className="stat-header">
          <BarChart3 size={20} />
          <h3>Task Statistics</h3>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon total">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon completed">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon high-priority">
              <AlertCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{highPriority}</span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>
        </div>
        <div className="completion-rate">
          <div className="rate-label">
            <span>Completion Rate</span>
            <span>{completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewMode, setViewMode] = useState('grid');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Back to top state and functionality
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initial sample tasks
  useEffect(() => {
    const initialTasks = [
      {
        id: 1,
        title: 'Complete React Project',
        description: 'Finish the task management app UI with prism theme',
        completed: false,
        priority: 'high',
        status: 'in-progress',
        dueDate: '2026-02-20',
        tags: ['react', 'frontend', 'important'],
        dueSoon: true
      },
      {
        id: 2,
        title: 'Team Sync Meeting',
        description: 'Weekly team sync and project update',
        completed: true,
        priority: 'medium',
        status: 'completed',
        dueDate: '2026-02-15',
        tags: ['meeting', 'team', 'communication']
      },
      {
        id: 3,
        title: 'Learn Advanced React Patterns',
        description: 'Study hooks, context, and performance optimization',
        completed: false,
        priority: 'medium',
        status: 'todo',
        dueDate: '2026-02-28',
        tags: ['learning', 'react', 'development']
      },
      {
        id: 4,
        title: 'Fix Production Bugs',
        description: 'Critical bug fixes for production deployment',
        completed: false,
        priority: 'high',
        status: 'in-progress',
        dueDate: '2026-02-18',
        tags: ['bugs', 'urgent', 'production'],
        dueSoon: true
      },
      {
        id: 5,
        title: 'Documentation Update',
        description: 'Update project documentation and README files',
        completed: false,
        priority: 'low',
        status: 'todo',
        dueDate: '2026-03-01',
        tags: ['documentation', 'writing']
      }
    ];
    setTasks(initialTasks);
  }, []);

  // Handle keyboard shortcuts and scroll for back to top
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape to close form
      if (e.key === 'Escape' && showForm) {
        setShowForm(false);
        setEditingTask(null);
      }
    };

    const handleScroll = () => {
      // For back to top button visibility
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showForm]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      completed: task.status === 'completed',
      dueSoon: isDueSoon(task.dueDate)
    };
    setTasks([...tasks, newTask]);
    setShowForm(false);
    // Show success animation or toast
  };

  const updateTask = (updatedTask) => {
    const updated = {
      ...updatedTask,
      completed: updatedTask.status === 'completed',
      dueSoon: isDueSoon(updatedTask.dueDate)
    };
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updated : task
    ));
    setEditingTask(null);
    setShowForm(false);
  };

  const isDueSoon = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    if (filter === 'high') return task.priority === 'high';
    if (filter === 'dueSoon') return task.dueSoon;
    return true;
  }).filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'created') return b.id - a.id;
    return 0;
  });

  const handleSubmit = (taskData) => {
    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id });
    } else {
      addTask(taskData);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setSortBy('dueDate');
  };

  const tasksDueToday = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today && !task.completed;
  }).length;

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
     
      <div className="prism-background"></div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
      
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <XIcon size={24} /> : <Menu size={24} />}
            </button>
            <div className="logo-icon">
              <Check size={32} />
            </div>
            <div>
              <h1> Task Manager</h1>
              <p>Organize with clarity and precision</p>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tasks... (Ctrl+K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button className="notification-btn">
              <Bell size={20} />
              {tasksDueToday > 0 && (
                <span className="notification-badge">{tasksDueToday}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Sidebar */}
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Dashboard</h3>
              <button 
                className="close-sidebar"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            
            <div className="sidebar-section">
              <button 
                className="btn-add-task"
                onClick={() => {
                  setEditingTask(null);
                  setShowForm(true);
                  setSidebarOpen(false);
                }}
              >
                <Plus size={20} />
                Add New Task
              </button>
            </div>

            <div className="sidebar-section">
              <h3>
                <Filter size={18} />
                Filters
              </h3>
              <div className="filter-group">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Tasks
                  <span className="filter-count">{tasks.length}</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  Active
                  <span className="filter-count">{tasks.filter(t => !t.completed).length}</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                  <span className="filter-count">{tasks.filter(t => t.completed).length}</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
                  onClick={() => setFilter('high')}
                >
                  High Priority
                  <span className="filter-count">{tasks.filter(t => t.priority === 'high').length}</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'dueSoon' ? 'active' : ''}`}
                  onClick={() => setFilter('dueSoon')}
                >
                  Due Soon
                  <span className="filter-count">{tasks.filter(t => t.dueSoon).length}</span>
                </button>
              </div>
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
                disabled={filter === 'all' && !searchTerm && sortBy === 'dueDate'}
              >
                Clear Filters
              </button>
            </div>

            <div className="sidebar-section">
              <h3>
                <Settings size={18} />
                Sort & Tools
              </h3>
              <div className="tool-group">
                <label>Sort By</label>
                <div className="sort-options">
                  {[
                    { value: 'dueDate', icon: <Calendar size={14} />, label: 'Due Date' },
                    { value: 'priority', icon: <Flag size={14} />, label: 'Priority' },
                    { value: 'title', icon: 'Aa', label: 'Title' },
                    { value: 'created', icon: <Clock size={14} />, label: 'Created' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`sort-btn ${sortBy === option.value ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy(option.value);
                        setSidebarOpen(false);
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="tool-group">
                <label>View Mode</label>
                <div className="view-toggle-group">
                  <button
                    className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                    Grid
                  </button>
                  <button
                    className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                    List
                  </button>
                </div>
              </div>
            </div>

            <Statistics tasks={tasks} />
          </div>

          {/* Main Content */}
          <div className="main-content">
            {showForm ? (
              <TaskForm
                task={editingTask}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            ) : (
              <>
                <div className="tasks-header">
                  <div className="tasks-header-info">
                    <h2>
                      {filter === 'all' && 'All Tasks'}
                      {filter === 'active' && 'Active Tasks'}
                      {filter === 'completed' && 'Completed Tasks'}
                      {filter === 'high' && 'High Priority Tasks'}
                      {filter === 'dueSoon' && 'Tasks Due Soon'}
                    </h2>
                    <p className="tasks-subtitle">
                      <span className="tasks-count">{filteredTasks.length}</span> of <span className="tasks-total">{tasks.length}</span> tasks
                      {searchTerm && (
                        <span className="search-info"> • Searching for "{searchTerm}"</span>
                      )}
                    </p>
                  </div>
                  <div className="tasks-header-actions">
                    <div className="mobile-filters">
                      <button 
                        className="mobile-filter-btn"
                        onClick={() => setSidebarOpen(true)}
                      >
                        <Filter size={18} />
                        Filters
                      </button>
                    </div>
                    <div className="view-controls">
                      <span className="view-label">View:</span>
                      <button 
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid size={16} />
                      </button>
                      <button 
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`tasks-container ${viewMode}`}>
                  {filteredTasks.length > 0 ? (
                    <div className={`tasks-display ${viewMode}`}>
                      {filteredTasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={toggleComplete}
                          onEdit={handleEdit}
                          onDelete={deleteTask}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state animate-fade-in">
                      <div className="empty-icon">
                        {searchTerm ? <Search size={48} /> : <Plus size={48} />}
                      </div>
                      <h3>
                        {searchTerm ? 'No tasks found' : 'No tasks yet'}
                      </h3>
                      <p>
                        {searchTerm 
                          ? 'Try adjusting your search terms or filters' 
                          : 'Create your first task to get started'}
                      </p>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          setEditingTask(null);
                          setShowForm(true);
                        }}
                      >
                        <Plus size={18} />
                        Add New Task
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

     <footer className="app-footer">
  <div className="footer-content">

    {/* Social Icons */}
    <div className="social-icons">
      <a
        href="https://github.com/developershubham01"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub size={24} />
      </a>

      <a
        href="https://www.linkedin.com/in/shubham-sharma395/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin size={24} />
      </a>
    </div>

    <p>
      <span className="pending-count">
        {tasks.filter(t => !t.completed).length}
      </span>{" "}
      tasks pending •
      <span className="completed-count">
        {" "}
        {tasks.filter(t => t.completed).length}
      </span>{" "}
      completed
    </p>

    <div className="footer-links">
      <button className="footer-link" onClick={() => setShowForm(true)}>
        Add Task
      </button>
      <button className="footer-link" onClick={clearFilters}>
        Clear All
      </button>
      <span className="footer-info">Task Manager v1.0</span>
    </div>

  </div>
</footer>


      {/* Back to Top Button - ADDED HERE */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
}

export default App;