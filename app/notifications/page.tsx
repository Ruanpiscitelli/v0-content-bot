import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

// Sample notification data
const notifications = [
  {
    id: "1",
    title: "Nova mensagem",
    message: "Você recebeu uma nova mensagem de @mariafernanda",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    type: "message",
  },
  {
    id: "2",
    title: "Novo seguidor",
    message: "@carlos_silva começou a seguir você",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    type: "follow",
  },
  {
    id: "3",
    title: "Menção em comentário",
    message: "@juliana_costa mencionou você em um comentário",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    type: "mention",
  },
  {
    id: "4",
    title: "Curtida em seu post",
    message: "@roberto_almeida curtiu seu post recente",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    type: "like",
  },
  {
    id: "5",
    title: "Atualização do sistema",
    message: "Novos recursos foram adicionados à plataforma",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: "system",
  },
  {
    id: "6",
    title: "Novo comentário",
    message: "@ana_beatriz comentou em sua foto: 'Adorei esse look!'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
    read: true,
    type: "mention",
  },
  {
    id: "7",
    title: "Curtida em seu comentário",
    message: "@pedro_henrique curtiu seu comentário",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    type: "like",
  },
  {
    id: "8",
    title: "Novo seguidor",
    message: "@marina_oliveira começou a seguir você",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
    type: "follow",
  },
]

// Helper function to get notification icon
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      )
    case "mention":
      return (
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
          </svg>
        </div>
      )
    case "like":
      return (
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      )
    case "follow":
      return (
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
      )
    case "system":
      return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
      )
    default:
      return null
  }
}

export default function NotificationsPage() {
  // Group notifications by date
  const today = notifications.filter((n) => new Date(n.timestamp).toDateString() === new Date().toDateString())
  const yesterday = notifications.filter(
    (n) => new Date(n.timestamp).toDateString() === new Date(Date.now() - 1000 * 60 * 60 * 24).toDateString(),
  )
  const older = notifications.filter(
    (n) =>
      new Date(n.timestamp).toDateString() !== new Date().toDateString() &&
      new Date(n.timestamp).toDateString() !== new Date(Date.now() - 1000 * 60 * 60 * 24).toDateString(),
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notificações</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-[#01aef0] text-white rounded-full">Todas</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Não lidas</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Menções</button>
          </div>
          <button className="text-sm text-gray-600 hover:text-gray-900">Marcar todas como lidas</button>
        </div>

        {/* Notifications List */}
        <div className="divide-y">
          {/* Today */}
          {today.length > 0 && (
            <div>
              <h3 className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Hoje</h3>
              {today.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start gap-4 ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Yesterday */}
          {yesterday.length > 0 && (
            <div>
              <h3 className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Ontem</h3>
              {yesterday.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start gap-4 ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Older */}
          {older.length > 0 && (
            <div>
              <h3 className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">Anteriores</h3>
              {older.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start gap-4 ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {notifications.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma notificação</h3>
              <p className="text-gray-500">Você não tem notificações no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
