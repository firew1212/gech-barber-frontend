import DashboardShell from '../../../components/layout/DashboardShell';
import { Card } from '../../../components/ui/Card';

export default function ServicesPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-zinc-500">
            Barber Shop
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Services
          </h1>
        </div>

        <Card className="p-8 text-center">
          <p className="text-sm text-zinc-500">
            Services will appear here.
          </p>
        </Card>
      </div>
    </DashboardShell>
  );
}