import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import SortingToggle from "./SortingToggle";

interface FloatingActionButtonProps {
    isDescending: boolean;
    setIsDescending: (value: boolean) => void;
}

export default function FloatingActionButton({ isDescending, setIsDescending }: FloatingActionButtonProps) {
    const [visible, setVisible] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setMenuOpen(false);
            setVisible(false);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setVisible(true);
            }, 1000);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleClick = () => {
        setMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="dim-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/40 z-40"
                        onClick={closeMenu}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {visible && (
                    <motion.div
                        key="fab"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <button
                            className="w-14 h-14 bg-gray-700 dark:bg-gray-100 text-white dark:text-black text-3xl font-bold rounded-full shadow-xl hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors flex items-center justify-center"
                            aria-label="Floating Action"
                            onClick={handleClick}
                        >
                            <Settings className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {menuOpen && (
                    <div>
                        <motion.div
                            key="darkModeToggle"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="fixed bottom-24 right-6 z-50 rounded-lg hover:bg-gray-500 shadow-lg w-14 h-14"
                        >
                            <DarkModeToggle />
                        </motion.div>
                        <motion.div
                            key="sortingToggle"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="fixed bottom-42 right-6 z-50 rounded-lg hover:bg-gray-500 shadow-lg w-14 h-14"
                        >
                            <SortingToggle isDescending={isDescending} setIsDescending={setIsDescending} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}