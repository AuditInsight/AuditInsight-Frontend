import { CardProps } from "./card.types";
import { cardStyles } from "./card.styles";

export function Card({ 
    children, 
    padding = 'md', 
}: CardProps) {
    return (
        <div 
            style={{
                ...cardStyles.base, 
                ...cardStyles .padding[padding],
            }}
        >
            {children}
        </div>
    );
}


