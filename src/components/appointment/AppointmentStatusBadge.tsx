import { AppointmentStatus } from '../../types/appointment';

export default function AppointmentStatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  const colors = {
    PENDING:
      'bg-yellow-500/20 text-yellow-400',

    CONFIRMED:
      'bg-blue-500/20 text-blue-400',

    IN_QUEUE:
      'bg-purple-500/20 text-purple-400',

    IN_SERVICE:
      'bg-orange-500/20 text-orange-400',

    COMPLETED:
      'bg-green-500/20 text-green-400',

    CANCELLED:
      'bg-red-500/20 text-red-400',

    NO_SHOW:
      'bg-zinc-500/20 text-zinc-400',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}