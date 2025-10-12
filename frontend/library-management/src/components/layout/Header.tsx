import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Menu, Search, X, LogIn } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '../ui/dropdown-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuth } from '@/hooks/useAuth'
import { settingsNavItem } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'
import logoImage from '@/assets/logo.png'

interface HeaderProps {
  activateItemId?: string
  onNavigate?: (id: string, href: string) => void
  navItems: NavItem[]
}

function Header({ activateItemId, onNavigate, navItems }: HeaderProps) {
  const isMobile = useIsMobile()
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const token = localStorage.getItem('accessToken')
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/', { replace: true })
    } catch {
      navigate('/', { replace: true })
    }
  }

  const handleLoginClick = () => navigate('/login')

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src={logoImage}
              alt="Book Library Logo"
              className="w-14 h-14"
            />
            <h2 className="lg:text-2xl font-bold tracking-tight sm:text-lg">
              Book Library
            </h2>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            {!isMobile && (
              <Input
                type="search"
                placeholder="Search your book..."
                className="md:w-[200px] lg:w-[300px]"
              />
            )}

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
              >
                {isSearchVisible ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
            </Button>

            {/* Auth actions */}
            {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@user"
                      />
                      <AvatarFallback>
                        {user?.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.role || 'User'}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size={isMobile ? 'sm' : 'default'}
                onClick={handleLoginClick}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                {!isMobile && 'Đăng nhập'}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        {isMobile && isSearchVisible && (
          <div className="px-4 pb-3">
            <Input
              type="search"
              placeholder="Search book..."
              className="w-full"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile menu overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3 rounded-lg px-3 py-2 text-base font-normal cursor-pointer',
                        item.id === activateItemId
                          ? 'bg-primary/10 text-primary-pink hover:bg-primary/20'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      )}
                      onClick={() => {
                        onNavigate?.(item.id, item.href)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  ))}
                </div>

                <div className="h-px bg-gray-200 my-4" />

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 py-2 text-base font-normal"
                >
                  <settingsNavItem.icon className="h-5 w-5" />
                  {settingsNavItem.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
