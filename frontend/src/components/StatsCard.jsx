function StatsCard({
    title,
    value
}) {

    return (

        <div className="card shadow p-4">

            <h6 className="text-muted">
                {title}
            </h6>

            <h2>
                {value}
            </h2>

        </div>
    );
}

export default StatsCard;