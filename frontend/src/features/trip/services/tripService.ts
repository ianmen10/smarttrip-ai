import api from "@/services/api";
import type {
  GenerateItineraryRequest,
  Trip,
  TripCreateRequest,
} from "@/types";

/**
 * Service untuk operasi trip management.
 */
export const tripService = {
  async getTrips(): Promise<Trip[]> {
    const response = await api.get<Trip[]>("/trips");
    return response.data;
  },

  async getTripById(id: number): Promise<Trip> {
    const response = await api.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  async createTrip(data: TripCreateRequest): Promise<Trip> {
    const response = await api.post<Trip>("/trips", data);
    return response.data;
  },

  async generateItinerary(data: GenerateItineraryRequest): Promise<Trip> {
    const response = await api.post<Trip>("/trips/generate-itinerary", data);
    return response.data;
  },

  async deleteTrip(id: number): Promise<void> {
    await api.delete(`/trips/${id}`);
  },
};
