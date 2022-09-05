import { useRouter } from 'next/router';
import {
  AppShell,
  Avatar,
  Divider,
  Loader,
  Menu,
  Navbar,
  NavLink,
  ScrollArea,
  Stack,
  Tooltip,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import {
  IconHash,
  IconHome2,
  IconLogin,
  TablerIcon,
} from '@tabler/icons';
import { useUser } from '../contexts/UserProvider';

interface NavbarItemProps {
  title: string,
  slug: string,
  icon: TablerIcon
}

function NavbarItem({ title, slug, icon: Icon }: NavbarItemProps) {
  const router = useRouter();

  return (
    <Tooltip label={title} position="right" withinPortal={true} withArrow>
      <NavLink
        icon={<Icon size={24} />}
        p={8}
        component={NextLink}
        href={`/${slug}`}
        active={router.pathname === `/${slug}`}
        styles={{ icon: { marginRight: 0 } }}
      />
    </Tooltip>
  );
}

interface LayoutProps {
  children: React.ReactNode,
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, logout } = useUser();

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 61 }} px="xs" py="xl">
          <Navbar.Section grow component={ScrollArea}>
            {user &&
              <Stack spacing='xs'>
                <NavbarItem
                  title="Home"
                  slug=""
                  icon={IconHome2}
                />
                <NavbarItem
                  title="Explore"
                  slug="explore"
                  icon={IconHash}
                />
              </Stack>
            }
          </Navbar.Section>
          <Divider my="xs" />
          <Navbar.Section>
            {user === undefined
              ? <Loader />
              : <>
                {user !== null
                  ? <Menu position="right-end" withinPortal>
                      <Menu.Target>
                        <NavLink
                          p={8}
                          icon={
                            <Avatar
                              src={user.avatar_url + '&s=16'}
                              alt={user.username}
                              size={24}
                              radius={12}
                            />
                          }
                        />
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item component={NextLink} href={'/user/' + user.username}>Profile</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item component={NextLink} href={'/password'}>Change Password</Menu.Item>
                        <Menu.Item onClick={logout}>Logout</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  : <NavbarItem
                      title="Login"
                      slug="login"
                      icon={IconLogin}
                    />
                }
              </>
            }
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {children}
    </AppShell>
  );
}