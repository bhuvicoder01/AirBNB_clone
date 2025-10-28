import React from "react";
import { Link } from "react-router-dom";
import { useProperty } from "../contexts/PropertyContext";
import PropertyGrid from "../components/property/PropertyGrid";
import SearchBar from "../components/search/SearchBar";

const Home = () => {
  const { properties, loading } = useProperty();

  const categories = [
    { name: "Beachfront", icon: "bi-water" },
    { name: "Cabins", icon: "bi-house-door" },
    { name: "Trending", icon: "bi-fire" },
    { name: "Pools", icon: "bi-droplet" },
    { name: "Mountains", icon: "bi-mountains" },
    { name: "Unique stays", icon: "bi-star" },
  ];

  return (
    <div>
      {/* Hero Section */}

      {window.innerWidth > 768 ? (
        <div className="bg-light py-5">
          <div className="container">
            <div className="text-center mb-4">
              <h1 className="display-4 fw-bold mb-3">Find your next stay</h1>
              <p className="lead text-muted">
                Search deals on hotels, homes, and much more...
              </p>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Categories */}
      <div className="container mt-4">
        <div className="d-flex gap-4 overflow-auto pb-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/search?category=${category.name}`}
              className="text-decoration-none text-dark text-center"
              style={{ minWidth: "100px" }}
            >
              <div className="category-item p-3 border rounded hover-shadow">
                <i className={`bi ${category.icon} fs-3 d-block mb-2`}></i>
                <small className="fw-semibold">{category.name}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Properties */}
      <div className="container mt-5">
        <h3 className="mb-4">Featured Properties</h3>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <PropertyGrid properties={properties.slice(0, 12)} />
        )}
      </div>

      {/* Inspiration Section */}
      <div className="bg-light mt-5 py-5">
        <div className="container">
          <h3 className="mb-4">Inspiration for your next trip</h3>
          <div className="row g-4">
            {[
              {
                city: "New York",
                distance: "45 miles away",
                image:
                  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
              },
              {
                city: "Los Angeles",
                distance: "340 miles away",
                image:
                  "https://images.unsplash.com/photo-1534190239940-9ba8944ea261",
              },
              {
                city: "Miami",
                distance: "560 miles away",
                image:
                  "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3",
              },
              {
                city: "Seattle",
                distance: "234 miles away",
                image:
                  "https://images.unsplash.com/photo-1555667849-59ba7d8fd48c",
              },
            ].map((destination) => (
              <div key={destination.city} className="col-md-3">
                <Link
                  to={`/search?location=${destination.city}`}
                  className="text-decoration-none"
                >
                  <div className="card border-0">
                    <img
                      src={destination.image}
                      className="card-img-top rounded"
                      alt={destination.city}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body px-0">
                      <h6 className="fw-bold mb-0">{destination.city}</h6>
                      <small className="text-muted">
                        {destination.distance}
                      </small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
