import Loading from '@/components/ui/Loading';

export default function CampaignLoading() {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center">
            <Loading size="lg" text="Loading Campaign..." />
        </div>
    );
}
