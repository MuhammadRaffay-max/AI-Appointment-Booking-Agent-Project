// Mobile Navigation
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// AI Chatbot Logic
class BookingChatbot {
    constructor() {
        this.state = {
            step: 'welcome',
            service: null,
            date: null,
            time: null
        };
        
        this.messagesContainer = document.getElementById('chatMessages');
        this.optionsContainer = document.getElementById('chatOptions');
        
        // Service definitions
        this.services = [
            { id: 'doctor', label: 'Doctor Consultation', icon: '🏥' },
            { id: 'salon', label: 'Salon Appointment', icon: '✂️' },
            { id: 'business', label: 'Business Meeting', icon: '💼' },
            { id: 'online', label: 'Online Consultation', icon: '💻' }
        ];
        
        this.init();
    }
    
    init() {
        this.showWelcome();
    }
    
    // Add a message to the chat
    addMessage(text, sender = 'ai') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Add animation delay for natural feel
        return new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Clear options
    clearOptions() {
        this.optionsContainer.innerHTML = '';
    }
    
    // Create option buttons
    showOptions(options, callback) {
        this.clearOptions();
        
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option.label || option;
            
            btn.addEventListener('click', () => {
                // Disable all buttons
                this.optionsContainer.querySelectorAll('button').forEach(b => {
                    b.disabled = true;
                    b.style.opacity = '0.5';
                });
                
                // Show user selection
                this.addMessage(option.label || option, 'user');
                
                // Process after short delay
                setTimeout(() => callback(option), 500);
            });
            
            this.optionsContainer.appendChild(btn);
        });
    }
    
    // Generate next 7 days
    generateDates() {
        const dates = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            
            dates.push({
                id: d.toISOString(),
                label: `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`,
                fullDate: d
            });
        }
        
        return dates;
    }
    
    // Generate time slots
    generateTimeSlots() {
        return [
            { id: '9am', label: '9:00 AM' },
            { id: '10am', label: '10:00 AM' },
            { id: '11am', label: '11:00 AM' },
            { id: '2pm', label: '2:00 PM' },
            { id: '3pm', label: '3:00 PM' },
            { id: '4pm', label: '4:00 PM' }
        ];
    }
    
    // Welcome step
    async showWelcome() {
        this.state.step = 'welcome';
        await this.addMessage('Hello! I\'m your AI booking assistant. I can help you schedule appointments instantly. What type of appointment would you like to book?');
        this.showOptions(this.services, (service) => {
            this.state.service = service;
            this.showDateSelection();
        });
    }
    
    // Date selection step
    async showDateSelection() {
        this.state.step = 'date';
        await this.addMessage(`Great choice! When would you like to schedule your ${this.state.service.label}?`);
        
        const dates = this.generateDates();
        this.showOptions(dates, (date) => {
            this.state.date = date;
            this.showTimeSelection();
        });
    }
    
    // Time selection step
    async showTimeSelection() {
        this.state.step = 'time';
        await this.addMessage('Perfect! What time works best for you?');
        
        const times = this.generateTimeSlots();
        this.showOptions(times, (time) => {
            this.state.time = time;
            this.showConfirmation();
        });
    }
    
    // Confirmation step
    async showConfirmation() {
        this.state.step = 'confirm';
        const summary = `Excellent! I've booked your ${this.state.service.label} for ${this.state.date.label} at ${this.state.time.label}.`;
        await this.addMessage(summary);
        await this.addMessage('You will receive a confirmation email shortly. Would you like to book another appointment?');
        
        this.showOptions([
            { id: 'yes', label: 'Book Another' },
            { id: 'no', label: 'No, Thanks' }
        ], (choice) => {
            if (choice.id === 'yes') {
                this.reset();
            } else {
                this.addMessage('Thank you! Have a great day! 👋');
                this.clearOptions();
                setTimeout(() => this.reset(), 3000);
            }
        });
    }
    
    // Reset chat
    reset() {
        this.state = {
            step: 'welcome',
            service: null,
            date: null,
            time: null
        };
        this.messagesContainer.innerHTML = '';
        this.clearOptions();
        setTimeout(() => this.showWelcome(), 500);
    }
}

// Initialize Chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new BookingChatbot();
    
    // Add scroll animation observer for fade-in elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards for fade-in effect
    document.querySelectorAll('.service-card, .benefit-card, .pricing-card, .testimonial-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Handle navbar background on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});