import  DashboardShell  from '../../../components/layout/DashboardShell';
import { Card } from '../../../components/ui/Card';

export default function BarbersPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-zinc-500">
            Team
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Barbers
          </h1>
        </div>

        <Card className="p-8 text-center">
          <p className="text-sm text-zinc-500">
            Barber management will appear here.
          </p>
        </Card>
      </div>
    </DashboardShell>
  );
}