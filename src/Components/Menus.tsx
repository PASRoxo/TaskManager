export const DashboardMenu = [
    {
        path: '/newTask',
        title: 'New Task',
        description: 'Create a new task from scratch',
    },
    {
        path: '/tasks',
        title: 'Task Management',
        description: 'Manage the tasks you created',
    },
]

export const SidebarMenu = [
    {
        path: '/',
        title: 'Dashboard',
        icon: <i className='bi bi-house' />
    },
    {
        path: '/tasks',
        title: 'Tasks',
        icon: <i className='bi bi-card-list' />
    },
]