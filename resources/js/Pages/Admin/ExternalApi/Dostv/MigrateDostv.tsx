import { App, Button, DatePicker, Progress, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { AppstoreOutlined } from '@ant-design/icons';

type Props = {
  onRefetch: () => void;
}

const MigrateDostv = ( { onRefetch }: Props) => {
  const { notification } = App.useApp();

  const [fromDate, setFromDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [toDate, setToDate] = useState<Dayjs>(dayjs().endOf('month'));
  const [loading, setLoading] = useState(false);
  const [migration, setMigration] = useState<any>(null);
  const previousStatusRef = useRef<string | null>(null);
  const shouldNotifyOnCompletionRef = useRef(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await axios.get('/admin/external-api/dostv-migration-status');
        const nextMigration = res.data?.migration ?? null;
        const previousStatus = previousStatusRef.current;
        const nextStatus = nextMigration?.status ?? null;

        setMigration(nextMigration);
        previousStatusRef.current = nextStatus;

        const hasTransitionedFromRunningState = previousStatus !== null
          && ['queued', 'processing'].includes(previousStatus)
          && nextStatus !== previousStatus;

        if (hasTransitionedFromRunningState && nextStatus === 'completed' && shouldNotifyOnCompletionRef.current) {
          shouldNotifyOnCompletionRef.current = false;
          onRefetch();
          notification.success({
            message: 'DOSTv migration completed.',
            duration: 3,
            showProgress: true,
          });
        }

        if (hasTransitionedFromRunningState && nextStatus === 'failed' && shouldNotifyOnCompletionRef.current) {
          shouldNotifyOnCompletionRef.current = false;
          notification.error({
            message: 'DOSTv migration failed.',
            description: nextMigration?.error_message ?? 'The queued migration did not complete.',
            duration: 4,
          });
        }
      } catch (error) {
        console.error('Failed to load migration status:', error);
      }
    };

    loadStatus();
  }, [notification, onRefetch]);

  useEffect(() => {
    if (migration?.status !== 'queued' && migration?.status !== 'processing') {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const res = await axios.get('/admin/external-api/dostv-migration-status');
        const nextMigration = res.data?.migration ?? null;
        const previousStatus = previousStatusRef.current;
        const nextStatus = nextMigration?.status ?? null;

        setMigration(nextMigration);
        previousStatusRef.current = nextStatus;

        const hasTransitionedFromRunningState = previousStatus !== null
          && ['queued', 'processing'].includes(previousStatus)
          && nextStatus !== previousStatus;

        if (hasTransitionedFromRunningState && nextStatus === 'completed' && shouldNotifyOnCompletionRef.current) {
          shouldNotifyOnCompletionRef.current = false;
          onRefetch();
          notification.success({
            message: 'DOSTv migration completed.',
            duration: 3,
            showProgress: true,
          });
        }

        if (hasTransitionedFromRunningState && nextStatus === 'failed' && shouldNotifyOnCompletionRef.current) {
          shouldNotifyOnCompletionRef.current = false;
          notification.error({
            message: 'DOSTv migration failed.',
            description: nextMigration?.error_message ?? 'The queued migration did not complete.',
            duration: 4,
          });
        }
      } catch (error) {
        console.error('Failed to load migration status:', error);
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [migration?.status, notification, onRefetch]);

  const handleMigrate = async () => {
    try {
      setLoading(true);
      shouldNotifyOnCompletionRef.current = true;

      const res = await axios.post('/admin/external-api/migrate-dostv-materials', {
        from: fromDate.format('YYYY-MM-DD'),
        to: toDate.format('YYYY-MM-DD'),
      });
      const nextMigration = res.data?.migration ?? null;
      setMigration(nextMigration);
      previousStatusRef.current = nextMigration?.status ?? null;
      notification.info({
        message: 'DOSTv migration queued.',
        description: 'Run a queue worker to process the import.',
        duration: 3,
        showProgress: true,
      });
    } catch (error) {
      shouldNotifyOnCompletionRef.current = false;
      console.error('Migration failed:', error);
      notification.error({
        message: axios.isAxiosError(error)
          ? error.response?.data?.message ?? 'Unable to queue DOSTv migration.'
          : 'Unable to queue DOSTv migration.',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const totalCount = Number(migration?.total_count ?? 0);
  const processedCount = Number(migration?.processed_count ?? 0);
  const progressPercent = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 md:flex-row'>
        <DatePicker
          value={fromDate}
          onChange={(value)=>{
            setFromDate(value ?? dayjs().startOf('month'));
          }}
        />
        <DatePicker
          value={toDate}
          onChange={(value)=>{
            setToDate(value ?? dayjs().endOf('month'));
          }}
        />

        <Button
          onClick={handleMigrate}
          type='primary'
          icon={<AppstoreOutlined />}
          loading={loading}
          disabled={migration?.status === 'queued' || migration?.status === 'processing'}
        >
          Migrate
        </Button>
      </div>

      {migration && (
        <div className='rounded-xl border border-slate-200 bg-slate-50 px-4 py-3'>
          <Typography.Text className='block text-sm text-slate-700'>
            Status: <span className='font-semibold uppercase'>{migration.status ?? 'idle'}</span>
          </Typography.Text>
          <Typography.Text className='block text-sm text-slate-700'>
            Range: {migration.requested_from ?? '-'} to {migration.requested_to ?? '-'}
          </Typography.Text>
          <Typography.Text className='block text-sm text-slate-700'>
            Progress: {processedCount} / {totalCount}
          </Typography.Text>
          <Progress percent={progressPercent} size='small' />
          {migration.error_message && (
            <Typography.Text type='danger' className='block text-sm'>
              {migration.error_message}
            </Typography.Text>
          )}
        </div>
      )}
    </div>
  )
}

export default MigrateDostv
