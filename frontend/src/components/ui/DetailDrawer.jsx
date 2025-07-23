import React from 'react';
import ActionButton from './ActionButton';

const DetailDrawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions = [],
  className = ""
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-responsive">
      {/* Backdrop */}
      <div 
        className="drawer-overlay"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`drawer-content ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-sage-200 dark:border-sage-700">
          <h2 className="text-responsive-h3 font-serif font-semibold text-sage-900 dark:text-sage-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-sage-400 hover:text-sage-600 dark:hover:text-sage-300 transition-colors duration-200 touch-target"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className={className}>
            {children}
          </div>
        </div>
        
        {/* Actions */}
        {actions.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-sage-200 dark:border-sage-700">
            <div className="actions-responsive">
              {actions.map((action, index) => (
                <ActionButton
                  key={index}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  className="action-button-responsive"
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </ActionButton>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailDrawer; 