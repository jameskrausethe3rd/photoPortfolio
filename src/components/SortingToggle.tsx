import { motion } from "framer-motion";
import { SortDesc } from "lucide-react";
import { useState } from "react";

interface SortingToggleProps {
    isDescending: boolean;
    setIsDescending: (value: boolean) => void;
}

const SortingToggle: React.FC<SortingToggleProps> = ({ isDescending, setIsDescending }) => {
    const [hasClicked, setHasClicked] = useState(false);

    const toggleDescending = () => {
        setHasClicked(true);
        setIsDescending(!isDescending);
        alert("Work in progress!");
    };

    return (
        <button
            onClick={toggleDescending}
            className="w-full h-full flex items-center justify-center rounded border bg-gray-700 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-500 dark:hover:bg-gray-500 shadow relative"
        >
            <motion.div
                animate={{ rotateX: isDescending ? 0 : 180 }}
                transition={{ duration: hasClicked ? 0.3 : 0 }}
                className="absolute"
                style={{ display: "flex", transformStyle: "preserve-3d" }}
            >
                <SortDesc size={20} />
            </motion.div>
        </button>
    );
};

export default SortingToggle;
