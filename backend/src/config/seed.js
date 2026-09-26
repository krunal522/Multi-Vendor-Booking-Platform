const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

const CATEGORIES = ["Salon","Home Cleaning","Plumbing","Electrical","AC Repair","Pest Control"];

const generateSlots = () => {
  const slots = [];
  for (let d = 1; d <= 14; d++) {
    const date = new Date(); date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    ["09:00","11:00","13:00","15:00","17:00"].forEach(time => {
      const [h, m] = time.split(":").map(Number);
      const endH = h + 1;
      slots.push({ date: dateStr, startTime: time, endTime: `${String(endH).padStart(2,"0")}:00`, isBooked: false });
    });
  }
  return slots;
};

async function seed() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/booking-platform");
    }
    console.log("Seeding...");

    await User.deleteMany({}); await Service.deleteMany({}); await Booking.deleteMany({}); await Review.deleteMany({});

    // Create Admin
    const admin = await User.create({ name: "Super Admin", email: "admin@techcorp.com", password: "Admin@123", role: "admin", isVerified: true, isActive: true });

    // Create Vendors
    const vendors = await User.insertMany([
      { name: "Raj Salon Studio", email: "vendor1@test.com", password: await bcrypt.hash("Vendor@123",12), role: "vendor", businessName: "Raj Premium Salon & Spa", businessCategory: "Salon", businessDescription: "Award-winning salon & wellness services at your doorstep. 10+ years experience with top stylists.", rating: 4.8, totalReviews: 142, isApproved: true, isVerified: true },
      { name: "CleanHome Services", email: "vendor2@test.com", password: await bcrypt.hash("Vendor@123",12), role: "vendor", businessName: "CleanHome Pro Elite", businessCategory: "Home Cleaning", businessDescription: "Professional deep cleaning with eco-friendly certified products and industrial tools.", rating: 4.6, totalReviews: 89, isApproved: true, isVerified: true },
      { name: "QuickFix Plumbing", email: "vendor3@test.com", password: await bcrypt.hash("Vendor@123",12), role: "vendor", businessName: "QuickFix Plumbing & Emergency", businessCategory: "Plumbing", businessDescription: "24/7 emergency pipe burst, leakage fix & bathroom fitting. All repairs guaranteed.", rating: 4.7, totalReviews: 201, isApproved: true, isVerified: true },
      { name: "CoolBreeze AC", email: "vendor4@test.com", password: await bcrypt.hash("Vendor@123",12), role: "vendor", businessName: "CoolBreeze AC Care", businessCategory: "AC Repair", businessDescription: "Certified HVAC technicians for all brands AC repair, deep foam jet service & gas refills.", rating: 4.5, totalReviews: 167, isApproved: true, isVerified: true },
      { name: "VoltMaster Electricals", email: "vendor5@test.com", password: await bcrypt.hash("Vendor@123",12), role: "vendor", businessName: "VoltMaster Pro", businessCategory: "Electrical", businessDescription: "Licensed residential electricians for rewiring, smart switches, MCB tripping, and surge protection.", rating: 4.9, totalReviews: 114, isApproved: true, isVerified: true },
    ]);

    // Create Customers
    const customers = await User.insertMany([
      { name: "Krunal Patel", email: "customer@test.com", password: await bcrypt.hash("Customer@123",12), role: "customer", isVerified: true },
      { name: "Priya Sharma", email: "priya@test.com", password: await bcrypt.hash("Customer@123",12), role: "customer", isVerified: true },
    ]);

    // Create Services with Real Photos
    const services = await Service.insertMany([
      { 
        vendor: vendors[0]._id, 
        title: "Full Body Luxury Spa & Swedish Massage", 
        slug: "full-body-spa-massage-" + Date.now(), 
        category: "Salon", 
        description: "Relaxing full body Swedish aromatherapy spa and massage therapy delivered in the comfort of your home by certified therapists.", 
        price: 1499, 
        priceType: "fixed", 
        duration: 90, 
        rating: 4.8, 
        totalReviews: 56, 
        totalBookings: 142, 
        isApproved: true, 
        isFeatured: true, 
        location: { city: "Mumbai", state: "Maharashtra", pincode: "400001" }, 
        images: ["/services/spa-massage.jpg"], 
        tags: ["spa", "massage", "aromatherapy", "wellness"], 
        slots: generateSlots() 
      },
      { 
        vendor: vendors[0]._id, 
        title: "Signature Bridal Makeup & HD Hairstyling", 
        slug: "bridal-makeup-" + Date.now(), 
        category: "Salon", 
        description: "Complete royal bridal makeup with HD finish, luxury international cosmetics, hair styling, draping, and pre-bridal consultation.", 
        price: 8999, 
        priceType: "fixed", 
        duration: 180, 
        rating: 4.9, 
        totalReviews: 34, 
        totalBookings: 67, 
        isApproved: true, 
        isFeatured: true, 
        location: { city: "Mumbai", state: "Maharashtra", pincode: "400050" }, 
        images: ["/services/bridal-makeup.jpg"], 
        tags: ["bridal", "makeup", "wedding", "glam"], 
        slots: generateSlots() 
      },
      { 
        vendor: vendors[1]._id, 
        title: "360° Deep Home Sanitization & Cleaning", 
        slug: "deep-home-cleaning-" + Date.now(), 
        category: "Home Cleaning", 
        description: "Comprehensive 2BHK/3BHK deep cleaning including kitchen degreasing, bathroom scrubbing, floor buffing, and sofa vacuuming with hospital-grade sanitizers.", 
        price: 2499, 
        priceType: "fixed", 
        duration: 240, 
        rating: 4.6, 
        totalReviews: 45, 
        totalBookings: 89, 
        isApproved: true, 
        isFeatured: true, 
        location: { city: "Bangalore", state: "Karnataka", pincode: "560001" }, 
        images: ["/services/home-cleaning.jpg"], 
        tags: ["cleaning", "deep clean", "sanitization", "home"], 
        slots: generateSlots() 
      },
      { 
        vendor: vendors[2]._id, 
        title: "Emergency Pipe Burst & Leakage Repair", 
        slug: "emergency-pipe-repair-" + Date.now(), 
        category: "Plumbing", 
        description: "24/7 on-call plumbing repairs for burst pipes, drain clogs, faucet replacements, and water pressure diagnostics. Guaranteed 60-minute arrival.", 
        price: 799, 
        priceType: "starting_from", 
        duration: 60, 
        rating: 4.7, 
        totalReviews: 78, 
        totalBookings: 201, 
        isApproved: true, 
        isFeatured: true, 
        location: { city: "Delhi", state: "Delhi", pincode: "110001" }, 
        images: ["/services/plumbing-repair.jpg"], 
        tags: ["plumbing", "pipe", "emergency", "repair"], 
        slots: generateSlots() 
      },
      { 
        vendor: vendors[3]._id, 
        title: "Deep Foam Jet AC Servicing & Gas Refill", 
        slug: "ac-service-gas-" + Date.now(), 
        category: "AC Repair", 
        description: "High-pressure jet wash for indoor & outdoor units, cooling coil antibacterial treatment, R32/R410A gas top-up, and cooling performance test.", 
        price: 699, 
        priceType: "starting_from", 
        duration: 90, 
        rating: 4.5, 
        totalReviews: 112, 
        totalBookings: 267, 
        isApproved: true, 
        isFeatured: true, 
        location: { city: "Hyderabad", state: "Telangana", pincode: "500001" }, 
        images: ["/services/ac-repair.jpg"], 
        tags: ["ac", "repair", "cooling", "jet-service"], 
        slots: generateSlots() 
      },
      { 
        vendor: vendors[4]._id, 
        title: "Smart Home Wiring & Circuit Breaker Overhaul", 
        slug: "electrical-wiring-overhaul-" + Date.now(), 
        category: "Electrical", 
        description: "Certified electrician services for MCB tripping diagnostics, smart switchboard installation, inverter connections, and full house safety grounding.", 
        price: 899, 
        priceType: "starting_from", 
        duration: 75, 
        rating: 4.9, 
        totalReviews: 62, 
        totalBookings: 184, 
        isApproved: true, 
        isFeatured: true, 
        location: { city: "Pune", state: "Maharashtra", pincode: "411001" }, 
        images: ["/services/electrical-repair.jpg"], 
        tags: ["electrical", "wiring", "smart-home", "safety"], 
        slots: generateSlots() 
      },
      { 
        vendor: vendors[1]._id, 
        title: "Intensive Kitchen Degreasing & Chimney Polish", 
        slug: "kitchen-degreasing-" + Date.now(), 
        category: "Home Cleaning", 
        description: "Thorough kitchen deep clean focusing on oily exhaust fans, stove burn marks, cabinet interiors, and tile grout whitening.", 
        price: 1299, 
        priceType: "fixed", 
        duration: 120, 
        rating: 4.4, 
        totalReviews: 18, 
        totalBookings: 32, 
        isApproved: false, 
        isFeatured: false, 
        location: { city: "Bangalore", state: "Karnataka", pincode: "560034" }, 
        images: ["/services/home-cleaning.jpg"], 
        tags: ["kitchen", "degrease", "chimney", "cleaning"], 
        slots: generateSlots() 
      }
    ]);

    // Create a Booking
    const booking = await Booking.create({
      customer: customers[0]._id, vendor: vendors[0]._id, service: services[0]._id,
      slot: { date: new Date(Date.now()+3*24*60*60*1000).toISOString().split("T")[0], startTime: "10:00", endTime: "11:30" },
      status: "completed", totalAmount: 1499, platformFee: 150, vendorEarnings: 1349,
      address: { street: "123 MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      payment: { method: "online", status: "paid", paidAt: new Date() }, isReviewed: true,
      statusHistory: [{ status: "completed" }]
    });

    // Create a Review
    await Review.create({
      booking: booking._id, service: services[0]._id, vendor: vendors[0]._id, customer: customers[0]._id,
      rating: 5, title: "Excellent service!", comment: "Really loved the spa session. Very professional and relaxing. Highly recommend!", isVerified: true
    });

    console.log("? Seed complete!");
    console.log("?? Admin:    admin@techcorp.com / Admin@123");
    console.log("?? Vendor:   vendor1@test.com / Vendor@123");
    console.log("?? Customer: customer@test.com / Customer@123");
  } catch (err) {
    console.error("Seed error:", err.message);
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0));
}

module.exports = seed;
