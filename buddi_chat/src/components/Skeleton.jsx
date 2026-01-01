import { motion } from 'framer-motion';

const Skeleton = ({ width, height, borderRadius = '0.5rem', className = '' }) => {
  return (
    <motion.div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
        borderRadius: borderRadius,
        background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%)',
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['100% 0%', '-100% 0%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

export const ChatSkeleton = () => (
  <div className="chat-skeleton w-100 p-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={`d-flex mb-4 ${i % 2 === 0 ? 'justify-content-end' : 'justify-content-start'}`}>
        <div className="d-flex align-items-end gap-2" style={{ maxWidth: '70%', flexDirection: i % 2 === 0 ? 'row-reverse' : 'row' }}>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
          <div className="d-flex flex-column gap-1">
            <Skeleton width={i % 2 === 0 ? '120px' : '180px'} height="40px" borderRadius="12px" />
            <Skeleton width="60px" height="10px" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
