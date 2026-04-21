import { prisma } from "@/lib/prisma"
import { createUser } from "./actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import UserActionsDropdown from "./UserActionsDropdown"

export default async function UsersManagementPage() {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage system access and roles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ADD USER FORM */}
        <div className="md:col-span-1">
          <div className="border rounded-lg shadow-sm bg-card text-card-foreground p-6">
            <h3 className="font-semibold tracking-tight text-xl mb-4">Add New User</h3>
            <form action={createUser} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium leading-none">Username</label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  id="username"
                  name="username"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium leading-none">Role</label>
                <select 
                  name="role" 
                  id="role"
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none"
                  required
                >
                  <option value="QC">QC</option>
                  <option value="OPERATIONAL">OPERATIONAL</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button 
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full mt-4"
              >
                Create User
              </button>
            </form>
          </div>
        </div>

        {/* USERS LIST */}
        <div className="md:col-span-2">
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/50">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Username</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {users.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">
                        <div className="flex flex-col">
                          <span>{user.username}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{user.id}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors
                          ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 
                            user.role === 'QC' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            'bg-orange-50 text-orange-700 border-orange-200'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <UserActionsDropdown 
                          userId={user.id} 
                          username={user.username} 
                          currentRole={user.role}
                          isSelf={user.id === session?.user?.id}
                        />
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-muted-foreground">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
