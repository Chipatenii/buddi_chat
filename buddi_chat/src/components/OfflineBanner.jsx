import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => (
    <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="position-fixed top-0 start-0 w-100 z-max pointer-events-none"
    >
        <div className="bg-danger text-white py-2 px-4 shadow-lg d-flex align-items-center justify-content-center gap-2 small fw-semibold backdrop-blur-md bg-opacity-90">
            <WifiOff size={16} className="animate-pulse" />
            <span>Connection lost. Operating in offline mode.</span>
        </div>
    </motion.div>
);

export default OfflineBanner;
