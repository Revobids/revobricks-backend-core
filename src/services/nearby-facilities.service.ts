import { Injectable } from '@nestjs/common';

export interface Facility {
  name: string;
  lat: number;
  lng: number;
  distance_km: number;
  type: string;
}

interface OSMElement {
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
  };
}

interface OSMResponse {
  elements: OSMElement[];
}

@Injectable()
export class NearbyFacilitiesService {
  private getDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async getNearbyFacilities(
    lat: number,
    lng: number,
    radius: number = 5000,
    type: string = 'school',
  ): Promise<Facility[]> {
    const query = `[out:json];node["amenity"="${type}"](around:${radius},${lat},${lng});out;`;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OSMResponse = await response.json();

      return data.elements.map((element: OSMElement) => ({
        name: element.tags.name || 'Unnamed',
        lat: element.lat,
        lng: element.lon,
        distance_km: parseFloat(
          this.getDistanceKm(lat, lng, element.lat, element.lon).toFixed(2),
        ),
        type: element.tags.amenity || type,
      }));
    } catch (error) {
      throw new Error('Failed to fetch facilities from OpenStreetMap');
    }
  }

  async getClosestFacilitiesByType(
    lat: number,
    lng: number,
    radius: number = 5000,
    facilityTypes?: string[],
  ): Promise<Facility[]> {
    // Default facility types if none provided
    const defaultTypes = [
      'school',
      'hospital',
      'restaurant',
      'bank',
      'pharmacy',
      'fuel',
      'police',
      'fire_station',
      'library',
      'park',
      'supermarket',
      'post_office',
    ];

    const typesToSearch = facilityTypes || defaultTypes;

    // Build query to search for multiple amenity types
    const query = `[out:json];(${typesToSearch
      .map(
        (type) => `node["amenity"="${type}"](around:${radius},${lat},${lng});`,
      )
      .join('')});out;`;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OSMResponse = await response.json();

      // Convert to facilities with distances
      const facilities = data.elements.map((element: OSMElement) => ({
        name: element.tags.name || 'Unnamed',
        lat: element.lat,
        lng: element.lon,
        distance_km: parseFloat(
          this.getDistanceKm(lat, lng, element.lat, element.lon).toFixed(2),
        ),
        type: element.tags.amenity || 'unknown',
      }));

      // Group by type and find the closest of each type
      const closestByType = new Map<string, Facility>();

      facilities.forEach((facility) => {
        const existing = closestByType.get(facility.type);
        if (!existing || facility.distance_km < existing.distance_km) {
          closestByType.set(facility.type, facility);
        }
      });

      // Return as array, sorted by distance
      return Array.from(closestByType.values()).sort(
        (a, b) => a.distance_km - b.distance_km,
      );
    } catch (error) {
      throw new Error('Failed to fetch facilities from OpenStreetMap');
    }
  }
}
