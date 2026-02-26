import { MONEY_LADDER } from '../../content/quiz'
import './MoneyLadder.css'

const SAFE_HAVENS = [4, 9]

export default function MoneyLadder({ currentIndex }) {
  return (
    <div className="money-ladder">
      <h3 className="money-ladder-title">Prize Ladder</h3>
      <ul className="money-ladder-list">
        {[...MONEY_LADDER].reverse().map((amount, i) => {
          const realIndex = MONEY_LADDER.length - 1 - i
          const isCurrent = realIndex === currentIndex
          const isPassed = realIndex < currentIndex
          const isSafe = SAFE_HAVENS.includes(realIndex)

          let cls = 'money-ladder-item'
          if (isCurrent) cls += ' money-ladder-item--current'
          if (isPassed) cls += ' money-ladder-item--passed'
          if (isSafe) cls += ' money-ladder-item--safe'

          return (
            <li key={realIndex} className={cls}>
              <span className="money-ladder-num">{realIndex + 1}</span>
              <span className="money-ladder-amount">{amount}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
