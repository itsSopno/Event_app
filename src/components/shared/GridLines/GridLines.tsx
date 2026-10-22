import './GridLines.css'

const VLINES = [0, 20, 60, 80, 100]

export default function GridLines() {
    return (
        <div className="grid-lines" aria-hidden>
            <div className="grid-lines__inner">
                {VLINES.map((p) => (
                    <span
                        key={p}
                        className={`grid-lines__vline${p === 0 || p === 100 ? '' : ' grid-lines__vline--inner'}`}
                        style={{ left: `calc(${p}% - ${p === 100 ? 1 : 0}px)` }}
                    />
                ))}
                <span className="grid-lines__hline grid-lines__hline--top" />
                <span className="grid-lines__hline grid-lines__hline--bottom" />
            </div>
        </div>
    )
}
