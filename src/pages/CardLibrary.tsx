import { Link } from "react-router-dom";
import MovementCardDisplay from "../components/MoveCardElement";
import { ALL_CARDS } from "../utils/cards";

function CardLibrary() {
    return (
        <div className="px-4 py-8">
            <h1 className="text-center text-2xl font-bold mb-6">Card Library</h1>
            <div className="flex flex-col gap-4">
                <Link to="/">
                    <button className="bg-[#1565C0] text-white px-4 py-2 rounded hover:bg-[#0d47a1] transition-colors">
                        Back
                    </button>
                </Link>
                <div className="flex flex-wrap gap-4">
                    {ALL_CARDS.map(card => {
                        return (
                            <div key={card.id} className="">
                                <MovementCardDisplay card={card} isSelected={false} isMuted={false} currentPlayer='red' onClickHandler={() => { }} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default CardLibrary;
