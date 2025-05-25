document.addEventListener('DOMContentLoaded', () => {
    // --- NAVIGATION BAR ANIMATION ---
    const mainNav = document.getElementById('mainNav');
    let lastScrollPosition = window.pageYOffset;

    mainNav.style.transition = 'opacity 0.5s ease, padding 0.5s ease';

    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        const scrollDelta = currentScrollPosition - lastScrollPosition;

        // Navbar shrink/expansion
        if (currentScrollPosition > 100) {
            mainNav.classList.add('navbar-shrink');
        } else {
            mainNav.classList.remove('navbar-shrink');
        }

        // Fade effect
        if (scrollDelta > 2) {
            mainNav.style.opacity = '0.8';
        } else if (scrollDelta < -2) {
            mainNav.style.opacity = '1';
        }

        lastScrollPosition = currentScrollPosition;
    });

    // --- SECTION ANIMATIONS ---
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(50px)';
                }
            });
        },
        { threshold: 0.3 }
    );

    document.querySelectorAll('section, .booking-form-container').forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(element);
    });

    // --- REVIEW CAROUSEL ---
    const reviewCards = document.querySelectorAll('.review-card');
    const thumbnails = document.querySelectorAll('.profile-thumbnails img');
    const prevButton = document.querySelector('.prev-review');
    const nextButton = document.querySelector('.next-review');
    let currentIndex = 2; // Start with third profile

    function updateReview(index) {
        const reviewCard = reviewCards[0];
        const currentThumbnail = thumbnails[index];

        // Update active thumbnail
        thumbnails.forEach((thumbnail, idx) => {
            thumbnail.classList.remove('active', 'inactive');
            idx === index ? thumbnail.classList.add('active') : thumbnail.classList.add('inactive');
        });

        // Update review content
        reviewCard.querySelector('.review-quote p').textContent = currentThumbnail.dataset.review;
        reviewCard.querySelector('.review-details strong').textContent = currentThumbnail.dataset.author;
        reviewCard.querySelector('.stars').innerHTML = Array.from({ length: currentThumbnail.dataset.rating }, () => '<i class="fas fa-star text-warning"></i>').join('');

        // Reorder thumbnails
        reorderThumbnails(index);
        currentIndex = index;
    }

    function reorderThumbnails(index) {
        const total = thumbnails.length;
        thumbnails.forEach((thumbnail, idx) => {
            const newIndex = (idx - index + total) % total;
            thumbnail.style.order = newIndex;
        });
    }

    // Initialize first review
    updateReview(currentIndex);

    // Navigation buttons
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        updateReview(currentIndex);
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateReview(currentIndex);
    });

    // --- DATE INITIALIZATION ---
    function setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('checkin-date').value = today;
        document.getElementById('checkout-date').value = today;
    }

    setCurrentDate();

    // --- BOOKING FORM HANDLER ---
    const bookingForm = document.getElementById('bookingForm');
    const arrivalDateInput = document.getElementById('arrivalDate');

    // Set minimum arrival date
    arrivalDateInput.min = new Date().toISOString().split('T')[0];

    // Update departure date based on arrival
    arrivalDateInput.addEventListener('change', () => {
        document.getElementById('departureDate').min = arrivalDateInput.value;
    });

    // Form submission
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateForm()) {
            alert('Please fill out all required fields.');
            return;
        }

        // Add this inside the bookingForm submit event listener
        fetch('../backend/submit_reservation.php', {
            method: 'POST',
            body: new FormData(bookingForm)
        })
        .then(response => response.text())
        .then(data => {
            alert('Reservation ID: ' + data);
        })
        .catch(error => console.error('Error:', error));

        // Log submission data
        console.log('Booking submitted:', {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            arrivalDate: arrivalDateInput.value,
            departureDate: document.getElementById('departureDate').value,
            roomType: document.getElementById('roomType').value,
            adults: document.getElementById('adults').value,
            children: document.getElementById('children').value,
            promoCode: document.getElementById('promoCode').value,
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        modal.hide();
    });

    // Form validation
    function validateForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'arrivalDate', 'departureDate', 'roomType', 'adults'];
        return requiredFields.every(field => 
            document.getElementById(field).value.trim() !== ''
        );
    }
});