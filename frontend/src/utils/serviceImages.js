export const CATEGORY_IMAGE_MAP = {
  "Salon": "/services/spa-massage.jpg",
  "Beauty & Spa": "/services/bridal-makeup.jpg",
  "Home Cleaning": "/services/home-cleaning.jpg",
  "Plumbing": "/services/plumbing-repair.jpg",
  "AC Repair": "/services/ac-repair.jpg",
  "Electrical": "/services/electrical-repair.jpg",
  "Pest Control": "/services/home-cleaning.jpg",
  "Painting": "/services/home-cleaning.jpg",
  "Carpentry": "/services/plumbing-repair.jpg",
  "Appliance Repair": "/services/ac-repair.jpg"
};

export const DEFAULT_SERVICE_IMAGE = "/services/home-cleaning.jpg";

/**
 * Returns a high-res photo for a service, falling back to its category image
 */
export function getServiceImage(service) {
  if (!service) return DEFAULT_SERVICE_IMAGE;
  if (service.images && service.images.length > 0 && service.images[0]) {
    return service.images[0];
  }
  return CATEGORY_IMAGE_MAP[service.category] || DEFAULT_SERVICE_IMAGE;
}
