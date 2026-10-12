function TopPerformersLeaderboard({
    performers = []
}) {

    return (

        <div className="card shadow p-4 leaderboard-card">

            <h5 className="mb-4">
                Top Performers
            </h5>

            {performers.length === 0 ? (

                <div className="text-muted">
                    No appraisal data yet.
                </div>

            ) : performers.map((performer) => (

                <div
                    key={performer.employee_id}
                    className="leaderboard-item"
                >
                    <div className="rank-badge">
                        #{performer.rank}
                    </div>

                    <div className="flex-grow-1">
                        <strong>
                            {performer.full_name}
                        </strong>
                        <small>
                            {performer.department || "Unassigned"}
                        </small>
                    </div>

                    <div className="rating-chip">
                        {performer.average_rating}
                    </div>
                </div>
            ))}

        </div>
    );
}

export default TopPerformersLeaderboard;
