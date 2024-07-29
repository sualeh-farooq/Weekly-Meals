import { MdNoFood } from "react-icons/md"
export default function DishesPlaceholder({ week }) {
    return (
        <>
            <div className='d-flex align-items-center justify-content-center gap-2  py-4' >
                <MdNoFood className='text-muted' size={30} />
                <h4 className='text-muted mt-2' >No dishes added for Week {week}</h4>
            </div>
        </>
    )
}