import React from 'react'

const BaseLayout = ({ title, children, className }) => {
    return (
        <div className={className}>
            <h1>{title}</h1>
            <hr/>
            <section>
                {children}
            </section>
        </div>
    )
}

export default BaseLayout;
