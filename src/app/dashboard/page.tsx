import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <div>
                <h1>Dashboard</h1>
                <p>This is a protected page. Only authenticated users can see this.</p>
            </div>
        </ProtectedRoute>
    );
}