const StarRating = ({ rating, size = 14 }: { rating: number; size?: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
                fill={i <= rating ? '#f97316' : '#e5e7eb'} stroke={i <= rating ? '#f97316' : '#e5e7eb'} strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

export default StarRating;
