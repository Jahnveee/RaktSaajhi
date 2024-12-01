function updateDistricts() {
    const stateSelect = document.getElementById('state');
    const districtSelect = document.getElementById('district');
    const districtsByState = {
        "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "West Godavari", "Y.S.R."],
        "Bihar": ["Araria", "Aurangabad", "Bhojpur", "Buxar", "Darbhanga", "Gaya", "Khagaria", "Munger", "Nalanda", "Patna", "Purnia", "Saharsa"],
        "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "South Delhi", "South East Delhi", "West Delhi"],
        "Maharashtra": ["Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Kolhapur", "Satara", "Solapur"],
        "Uttar Pradesh": ["Agra", "Aligarh", "Bareilly", "Bijnor", "Etawah", "Fatehpur", "Ghaziabad", "Gorakhpur", "Kanpur", "Lucknow", "Mathura"]
    };

    const selectedState = stateSelect.value;

    // Clear out existing district options
    districtSelect.innerHTML = "";

    if (selectedState && districtsByState[selectedState]) {
        const districts = districtsByState[selectedState];
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}
