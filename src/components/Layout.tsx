import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Sidebar } from 'primereact/sidebar';
import { useAuthStore } from '@/store/authStore';
import { MenuItem } from '@/types';
import '@/styles/layout.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuVisible(false);
      }
    };

    if (userMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuVisible]);

  type ExtendedMenuItem = MenuItem & { path?: string; items?: ExtendedMenuItem[] };

  const menuItems: ExtendedMenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      to: '/dashboard',
      path: '/dashboard',
      command: () => {
        navigate('/dashboard');
        setSidebarVisible(false);
      }
    },
    {
      label: 'Nova Redação',
      icon: 'pi pi-plus',
      to: '/essays/new',
      path: '/essays/new',
      command: () => {
        navigate('/essays/new');
        setSidebarVisible(false);
      }
    },
    {
      label: 'Minhas Redações',
      icon: 'pi pi-file-edit',
      items: [
        {
          label: 'Todas',
          icon: 'pi pi-list',
          to: '/essays',
          path: '/essays',
          command: () => {
            navigate('/essays');
            setSidebarVisible(false);
          }
        },
        {
          label: 'Rascunhos',
          icon: 'pi pi-file',
          to: '/essays/drafts',
          path: '/essays/drafts',
          command: () => {
            navigate('/essays/drafts');
            setSidebarVisible(false);
          }
        },
        {
          label: 'Analisadas',
          icon: 'pi pi-check-circle',
          to: '/essays/analyzed',
          path: '/essays/analyzed',
          command: () => {
            navigate('/essays/analyzed');
            setSidebarVisible(false);
          }
        }
      ]
    },
    {
      label: 'Feedbacks',
      icon: 'pi pi-comments',
      to: '/feedbacks',
      path: '/feedbacks',
      command: () => {
        navigate('/feedbacks');
        setSidebarVisible(false);
      }
    },
    {
      label: 'Sobre',
      icon: 'pi pi-info-circle',
      to: '/about',
      path: '/about',
      command: () => {
        navigate('/about');
        setSidebarVisible(false);
      }
    }
  ];

  const handleLogout = () => {
    clearAuth();
    setSidebarVisible(false);
  };


  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/profile') return 'Meu Perfil';
    if (path === '/about') return 'Sobre';
    if (path === '/essays/new') return 'Nova Redação';
    if (path === '/essays') return 'Todas as Redações';
    if (path === '/essays/drafts') return 'Rascunhos';
    if (path === '/essays/analyzed') return 'Redações Analisadas';
    if (path === '/feedbacks') return 'Feedbacks';
    return 'Zen';
  };

  const start = (
    <div className="flex items-center gap-4">
      <div
        className="lg:hidden cursor-pointer header-circle-button"
        onClick={() => setSidebarVisible(true)}
        role="button"
        aria-label="Menu"
      >
        <i className="pi pi-bars"></i>
      </div>

      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center">
          <img
            src="/assets/zen-logo.png"
            alt="Zen Logo"
            className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
          />
        </div>
        <div className="hidden sm:block">
          <span className="font-bold text-3xl lg:text-4xl text-[#9ea04f]">
            Zen
          </span>
        </div>
      </div>
    </div>
  );

  const end = (
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <span className="text-gray-600 font-medium">{getPageTitle()}</span>
      </div>

      <div className="relative" ref={userMenuRef}>
        <div
          className={`flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md ${userMenuVisible ? 'user-dropdown-button-active' : ''
            }`}
          onClick={(e) => {
            console.log('Clicou no dropdown do usuário');
            e.preventDefault();
            e.stopPropagation();
            setUserMenuVisible(!userMenuVisible);
          }}
        >
          <Avatar
            key={user?.profilePictureUrl || 'avatar-header'}
            image={user?.profilePictureUrl
              ? (user.profilePictureUrl.startsWith('http://') || user.profilePictureUrl.startsWith('https://'))
                ? user.profilePictureUrl
                : `http://localhost:8080${user.profilePictureUrl}`
              : undefined}
            label={!user?.profilePictureUrl ? user?.name?.charAt(0).toUpperCase() : undefined}
            className="bg-[#C7D882] text-white shadow-sm"
            size="normal"
            shape="circle"
          />
          <div className="hidden md:block min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.name?.split(' ')[0]}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user?.schoolGrade || 'Estudante'}
            </div>
          </div>
          <i className="pi pi-chevron-down text-gray-400 text-xs transition-transform duration-200"></i>
        </div>

        {userMenuVisible && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <button
              onClick={() => {
                navigate('/profile');
                setUserMenuVisible(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <i className="pi pi-user text-gray-500"></i>
              <span className="text-gray-700 font-medium">Meu Perfil</span>
            </button>

            <hr className="my-2 border-gray-200" />

            <button
              onClick={() => {
                handleLogout();
                setUserMenuVisible(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-[#F5EFE9] flex items-center gap-3 transition-colors"
            >
              <i className="pi pi-sign-out text-[#C7D882]"></i>
              <span className="text-[#C7D882] font-medium">Sair</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {start}
          {end}
        </div>
      </div>

      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="left"
        className="w-80"
        pt={{
          closeButton: {
            className: 'absolute right-4 top-4 z-50 !bg-transparent !border-none !text-[#C7D882] hover:!text-[#C7D882] !shadow-none'
          },
          root: {
            className: '!p-0'
          },
          content: {
            className: '!p-0'
          }
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-4 pt-6 pb-4 border-b border-gray-200">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/robot2Icon.png"
                alt="Zen Robot Icon"
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-3xl text-[#9ea04f] !text-[#9ea04f]">
                Zen
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.items ? (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 p-3 text-gray-700 font-medium border-b border-gray-100">
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </div>
                    <div className="ml-6 mt-2 space-y-1">
                      {(item.items as ExtendedMenuItem[]).map((subItem, subIndex) => {
                        const isActive = location.pathname === subItem.path;
                        return (
                          <button
                            key={subIndex}
                            onClick={subItem.command}
                            className={`flex items-center gap-3 w-full p-3 text-left rounded-lg transition-colors duration-200 ${isActive
                              ? 'bg-[#C7D882] text-white'
                              : 'text-gray-600 hover:bg-[#F5EFE9] hover:text-[#C7D882]'
                              }`}
                          >
                            <i className={subItem.icon}></i>
                            <span>{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={item.command}
                    className={`flex items-center gap-3 w-full p-3 text-left rounded-lg transition-colors duration-200 font-medium ${location.pathname === item.path
                      ? 'bg-[#C7D882] text-white'
                      : 'text-gray-700 hover:bg-[#F5EFE9] hover:text-[#C7D882]'
                      }`}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Sidebar>

      <main className="container mx-auto px-4 py-6 lg:px-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8 py-4">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img
                  src="/assets/zen-logo.png"
                  alt="Zen Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-gray-700 font-medium text-sm whitespace-nowrap">© 2025 Zen. Todos os direitos reservados.</span>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Desenvolvido pela equipe <span className="font-semibold text-[#C7D882]">FloWrite</span> para apoiar estudantes do ENEM
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

