import data from '../data/matches.json';

const score = (v) => v === null || v === undefined ? '–' : v;

function MatchCard({ match }) {
  const complete = match.status.toLowerCase().includes('ft');
  const aWinner = match.winner === match.teamA;
  const bWinner = match.winner === match.teamB;

  return (
    <article className={`match-card ${complete ? 'complete' : ''}`}>
      <div className="match-meta"><span>{match.id}</span><span>{match.date} · {match.time}</span></div>
      <div className={`team-row ${aWinner ? 'winner' : ''}`}><span>{match.teamA}</span><strong>{score(match.scoreA)}</strong></div>
      <div className={`team-row ${bWinner ? 'winner' : ''}`}><span>{match.teamB}</span><strong>{score(match.scoreB)}</strong></div>
      {match.pensA !== null && match.pensB !== null && <p className="pens">Penalties: {match.pensA}-{match.pensB}</p>}
      <div className={`pill ${complete ? 'green' : 'amber'}`}>{match.status}</div>
    </article>
  );
}

function PathCard({ id, matches }) {
  const labels = matches.map((m) => m.winner || `Winner: ${m.teamA} / ${m.teamB}`);
  return <div className="path-card"><small>{id}</small><p>{labels[0] || 'TBD'}</p><p>{labels[1] || 'TBD'}</p></div>;
}

export default function Home() {
  const matches = data.matches;
  const complete = matches.filter((m) => m.status.toLowerCase().includes('ft'));
  const nextMatch = matches.find((m) => m.status === 'Scheduled');
  const grouped = matches.reduce((acc, match) => {
    acc[match.next] = acc[match.next] || [];
    acc[match.next].push(match);
    return acc;
  }, {});

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Traction Live</p>
          <h1>World Cup 2026 Knockout Tracker</h1>
          <p className="lede">Official results only. Irish kick-off times. No clutter.</p>
        </div>
        <div className="update-card"><span>Last updated</span><strong>{data.lastUpdated}</strong></div>
      </section>

      <section className="dashboard">
        <div className="stat"><span>{complete.length}</span><small>Completed</small></div>
        <div className="stat"><span>{matches.length - complete.length}</span><small>Scheduled</small></div>
        <div className="next"><small>Next match</small><strong>{nextMatch ? `${nextMatch.teamA} v ${nextMatch.teamB}` : 'TBD'}</strong><span>{nextMatch ? `${nextMatch.date} · ${nextMatch.time}` : ''}</span></div>
      </section>

      <section className="section-head"><p className="eyebrow">Round of 32</p><h2>Fixtures and results</h2></section>
      <section className="match-grid">{matches.map((match) => <MatchCard key={match.id} match={match} />)}</section>

      <section className="section-head"><p className="eyebrow">Tournament path</p><h2>Round of 16 feed</h2></section>
      <section className="path-grid">{Object.entries(grouped).map(([id, group]) => <PathCard key={id} id={id} matches={group} />)}</section>
    </main>
  );
}
