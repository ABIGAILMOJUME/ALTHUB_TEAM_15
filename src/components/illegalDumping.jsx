import React, { useState, useRef, useCallback, useEffect } from "react";
import Sidebar from "./navigation";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import apiFetch from "../lib/api"; // Import the apiFetch utility

const IllegalDumping = () => {
  const navigate = useNavigate();
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: 6.5244, // Centered on Lagos, Nigeria for better initial view
    lng: 3.3792,
  };

  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasteType, setWasteType] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const fileInputRef = useRef(null);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback(mapInstance) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map) {
      // A small delay to ensure the container has resized before triggering the map resize.
      const timer = setTimeout(() => {
        if (window.google && window.google.maps) {
          window.google.maps.event.trigger(map, 'resize');
          map.setCenter(center); // Re-center the map after resize
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [map, center]);

  const onLoadSearchBox = useCallback(function callback(ref) {
    setSearchBox(ref);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedPlace({
          name: place.name,
          address: place.formatted_address,
          location: newCenter,
        });
        map?.panTo(newCenter);
        map?.setZoom(15);
        setIsModalOpen(true);
      }
    }
  }, [searchBox, map]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
        setIsGeolocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newCenter = { lat: latitude, lng: longitude };

                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: newCenter }, (results, status) => {
                    setIsGeolocating(false);
                    if (status === 'OK') {
                        if (results[0]) {
                            setSelectedPlace({
                                name: 'Current Location',
                                address: results[0].formatted_address,
                                location: newCenter,
                            });
                            map?.panTo(newCenter);
                            map?.setZoom(15);
                            setIsModalOpen(true);
                        } else {
                            toast.error('No address found for your location.');
                        }
                    } else {
                        toast.error(`Geocoder failed due to: ${status}`);
                    }
                });
            },
            (error) => {
                setIsGeolocating(false);
                toast.error(`Error getting your location: ${error.message}`);
            }
        );
    } else {
        toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 1000 * 1024) {
        toast.error("File size exceeds 1mb limit.");
        setUploadedFile(null);
      } else {
        setUploadedFile(file);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 1000 * 1024) {
        toast.error("File size exceeds 1mb limit.");
        setUploadedFile(null);
      } else {
        setUploadedFile(file);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmitReport = async () => {
    if (!wasteType || !description || !uploadedFile || !selectedPlace) {
      toast.error("Please fill in all required fields and upload an image.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('issue_type', wasteType);
    formData.append('location', selectedPlace.address);
    formData.append('description', description);
    formData.append('file', uploadedFile);

    try {
      const response = await apiFetch('https://binit-1fpv.onrender.com/report', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setWasteType("");
        setDescription("");
        setUploadedFile(null);
        setIsModalOpen(false);
        setSelectedPlace(null);

        toast.success("Thank you for your report! We'll look into it shortly.", {
          duration: 5000,
        });
      } else {
        const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
        toast.error(errorData.message || "Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Submit report error:", error);
      toast.error("An error occurred while submitting the report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-10 p-4 overflow-hidden w-full bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Report Illegal Bin Disposal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Spot an overflowing or improperly placed bin? Snap a photo, share the location, and help keep your community clean and safe.
            </p>
          </div>
          <button onClick={() => navigate('/history')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center shadow-md transition-transform transform hover:-translate-y-1 md:w-auto w-full">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Report History
          </button>
        </div>

        <div className="relative w-full flex-grow rounded-lg shadow-lg overflow-hidden">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}  libraries={["places"]}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              options={mapOptions}
            >
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className="relative flex-grow w-96">
                  <StandaloneSearchBox
                    onLoad={onLoadSearchBox}
                    onPlacesChanged={onPlacesChanged}
                  >
                    <input
                      type="text"
                      placeholder="Search for a location..."
                      className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full dark:text-gray-100"
                    />
                  </StandaloneSearchBox>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
                <button 
                    onClick={handleGetCurrentLocation} 
                    disabled={isGeolocating}
                    className="p-2.5 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    title="Use my current location"
                >
                    {isGeolocating ? (
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
              </div>

              <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                <button className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                </button>
                <button className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
              </div>

              {/* Instructional Overlay */}
              {!selectedPlace && !isModalOpen && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-white dark:bg-gray-800 bg-opacity-90 rounded-lg shadow-lg text-center pointer-events-none">
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Use the search bar to find and report a location or click on the location button to use current location.
                  </p>
                </div>
              )}

              {markers.map((marker) => (
                <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} />
              ))}
            </GoogleMap>
          </LoadScript>
          <Toaster />
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Capture Evidence
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Waste Type*
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                  >
                    <option value="">Select waste type</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Organic">Organic</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Hazardous">Hazardous</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Photo*
                  </label>
                  <div
                    className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => fileInputRef.current.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/svg+xml, image/png, image/jpeg, image/gif"
                    />
                    <div className="space-y-1 text-center">
                      {uploadedFile ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          File selected: <span className="font-medium">{uploadedFile.name}</span>
                        </p>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L36 32h-4m-4 4v2m-6-12H6"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium text-green-600 hover:text-green-500">
                              Click to upload or drag and drop
                            </p>
                          </div>
                        </>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">(Max 800KB file size)</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Describe the issue*
                  </label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows="3"
                    placeholder="Tell us what you see so we can act quickly."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmitReport}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Report'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IllegalDumping;