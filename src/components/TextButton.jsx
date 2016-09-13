require('./TextButton.less');

// dependencies
import React  from 'react';
import Hammer from 'react-hammerjs';
import cn     from 'classnames';

// defaults
const classesDefault = [];
const onClickDefault = () => {};

// component
const TextButton = ({
    classes = classesDefault,
    onClick = onClickDefault,
    children
}) => {
    // class names
    const className = cn(['cf-text-button', ...classes]);

    // return jsx
    return (
        <Hammer onTap={onClick}>
            <div className={className}>
                <button className='button'>{children}</button>
            </div>
        </Hammer>
    );
};

// exports
export { classesDefault };
export default TextButton;