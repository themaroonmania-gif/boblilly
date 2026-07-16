document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('paywall-modal');
    const closeBtns = document.querySelectorAll('.close-modal, #close-modal-btn');
    const payBtn = document.getElementById('pay-now-btn');
    const allLinks = document.querySelectorAll('a');

    // Function to open modal
    const openModal = (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Intercept all link clicks
    allLinks.forEach(link => {
        link.addEventListener('click', openModal);
    });

    // Close modal events
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Pay button interaction
    if(payBtn) {
        payBtn.addEventListener('click', () => {
            payBtn.textContent = 'Processing Payment of $1,000,000...';
            setTimeout(() => {
                alert('Payment Failed: Insufficient funds. Thomas Harden remains unpaid.');
                payBtn.textContent = 'Pay Thomas Harden';
            }, 1500);
        });
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Add glowing mouse effect for premium feel
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Slight parallax effect on hero visuals
        const floatCards = document.querySelectorAll('.glass-card');
        floatCards.forEach((card, index) => {
            const speed = (index + 1) * 0.05;
            const moveX = (window.innerWidth / 2 - x) * speed;
            const moveY = (window.innerHeight / 2 - y) * speed;
            
            // Don't override animations entirely, just add a subtle transform
            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
});
