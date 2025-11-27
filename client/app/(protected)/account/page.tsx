import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


// Mock data based on user schema
const usersData = [
    {
        _id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        isActive: true,
        lastLogin: "2025-06-25T10:15:30Z",
    },
    {
        _id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "editor",
        isActive: true,
        lastLogin: "2025-06-22T14:30:00Z",
    },
    {
        _id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "viewer",
        isActive: false,
        lastLogin: "2025-06-25T09:45:00Z",
    },
    {
        _id: "4",
        name: "Alice Williams",
        email: "alice.williams@example.com",
        role: "editor",
        isActive: true,
        lastLogin: "2025-06-22T14:30:00Z",
    },
    {
        _id: "5",
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        role: "admin",
        isActive: false,
        lastLogin: "2025-06-20T10:15:30Z",
    },
];

export default function AccountsPage() {
    return (
        <main className="container max-w-6xl mx-auto px-6 mt-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        User Accounts
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and view all registered user accounts
                    </p>
                </div>
                <Table>
                    <TableCaption>
                        A list of all registered user accounts.
                    </TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-[#152bff] via-[#081bee] to-[#15269a]">
                            <TableHead className="text-white">#</TableHead>
                            <TableHead className="text-white">Name</TableHead>
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Role</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">
                                Last Login
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usersData.map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={"outline"}
                                        className="capitalize"
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.isActive
                                                ? "default"
                                                : "destructive"
                                        }
                                        className={
                                            user.isActive
                                                ? "bg-green-600 hover:bg-green-700"
                                                : ""
                                        }
                                    >
                                        {user.isActive ? "Active" : "Disabled"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}
