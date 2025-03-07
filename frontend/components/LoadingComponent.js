export default function LoadingComponent() {
    return (
        <div className="text-center py-3">
            <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
            <span className="ms-2">로딩 중...</span>
        </div>
    );
}
