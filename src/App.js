import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

function App() {
  const [api, setApi] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);

  useEffect(() => {
    axios
      .get("https://blood-donation-list-backend.vercel.app/")
      .then((response) => {
        setApi(response.data);
        setLoader(false);
      })
      .catch((error) =>
        console.error("There was an error fetching the data!", error)
      );
  }, []);

  // Apply logic based on whether searchMobile is used
  const filteredData = api.filter((person) => {
    if (searchMobile.trim() !== "") {
      return person.MobileNumber?.includes(searchMobile.trim());
    }

    return (
      (selectedBloodGroup === "" || person.BloodGroup === selectedBloodGroup) &&
      (selectedCountry === "" || person.Country === selectedCountry) &&
      (selectedState === "" || person.State === selectedState) &&
      (selectedDistrict === "" || person.District === selectedDistrict) &&
      (selectedCity === "" || person.City === selectedCity)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilter = (field, value) => {
    if (searchMobile) return; // Ignore filters when mobile is searched

    switch (field) {
      case "bloodgroup":
        setSelectedBloodGroup(value);
        break;
      case "country":
        setSelectedCountry(value);
        break;
      case "state":
        setSelectedState(value);
        setSelectedDistrict("");
        setSelectedCity("");
        break;
      case "district":
        setSelectedDistrict(value);
        setSelectedCity("");
        break;
      case "city":
        setSelectedCity(value);
        break;
      default:
        break;
    }
  };

  const bloodGroups = [...new Set(api.map((item) => item.BloodGroup))].sort();
  const states = [...new Set(api.map((item) => item.State))].sort();
  const districts = [...new Set(api
    .filter((item) => item.State === selectedState)
    .map((item) => item.District))].sort();
  const cities = [...new Set(api
    .filter((item) => item.District === selectedDistrict)
    .map((item) => item.City))].sort();

  return (
    <>
      {loader ? (
        <div className="vh-100 w-50 mx-auto d-flex justify-content-center align-items-center">
          <img
            src="https://loading.io/assets/mod/spinner/spinner/lg.gif"
            alt="Loading..."
            className="img-fluid w-100 h-100 object-fit-contain"
          />
        </div>
      ) : (
        <div className="container">
          <h1 className="mt-2 mx-auto" style={{ width: '150px', height: '150px' }}>
            <img src={require('./reviews1.png')} className="img-fluid text-center" alt="logo" />
          </h1>
          {/* Mobile Search Input */}
          <div className="row p-0 m-0 g-3">
            <div className="col-12 ps-0">
              <div className="col-12 col-md-6 col-lg-3 ms-auto ps-3">
                <input
                  type="tel"
                  className="w-100 py-2 px-1 "
                  placeholder=" Search by Mobile No"
                  value={searchMobile}
                  onChange={(e) => {
                    setSearchMobile(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <select
                onChange={(e) => handleFilter("bloodgroup", e.target.value)}
                value={selectedBloodGroup}
                className="w-100 py-2 px-1"
                disabled={!!searchMobile}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bloodgroup) => (
                  <option key={bloodgroup} value={bloodgroup}>
                    {bloodgroup}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <select
                onChange={(e) => handleFilter("state", e.target.value)}
                value={selectedState}
                className="w-100 py-2 px-1"
                disabled={!!searchMobile}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <select
                onChange={(e) => handleFilter("district", e.target.value)}
                value={selectedDistrict}
                className="w-100 py-2 px-1"
                disabled={!selectedState || !!searchMobile}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <select
                onChange={(e) => handleFilter("city", e.target.value)}
                value={selectedCity}
                className="w-100 py-2 px-1"
                disabled={!selectedDistrict || !!searchMobile}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>



          </div>

          <div className="table-responsive mt-3">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="py-2 text-light text-center" style={{ backgroundColor: "#be3438" }}>Sr.</th>
                  <th className="py-2 text-light text-center" style={{ backgroundColor: "#be3438" }}>Name</th>
                  <th className="py-2 text-light text-center" style={{ backgroundColor: "#be3438" }}>Mobile No</th>
                  <th className="py-2 text-light text-center" style={{ backgroundColor: "#be3438" }}>Blood group</th>
                  <th className="py-2 text-light text-center" style={{ backgroundColor: "#be3438" }}>Country</th>
                  <th className="py-2 text-light text-center" style={{ backgroundColor: "#be3438" }}>State</th>
                  <th className="py-2 text-light text-center" style={{ backgroundColor: "#be3438" }}>District</th>
                  <th className="py-2 text-light text-center" style={{ backgroundColor: "#be3438" }}>City</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((person, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="text-capitalize">{person.name}</td>
                      <td>{person.MobileNumber}</td>
                      <td>{person.BloodGroup}</td>
                      <td>{person.Country}</td>
                      <td>{person.State}</td>
                      <td>{person.District}</td>
                      <td>{person.City}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-danger">No matching records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls p-1 fw-medium text-end">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-white p-1 fs-4 fw-bold m-1 border-0 px-3"
              style={{ backgroundColor: '#be3438' }}
            >
              &lt;
            </button>
            <span className="m-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-white p-1 fs-4 fw-bold m-1 border-0 px-3"
              style={{ backgroundColor: '#be3438' }}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
