import React, { useState, useEffect } from "react";
import '../index.css';
import axios from '../axiosConfig';  // Assuming axios is configured for API requests
import {
  Box, FormControl, FormLabel, Select, RadioGroup, Radio, Button, Stack, Tooltip, IconButton, Divider
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';  // Import the info icon for tooltips
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';


const Questionnaire = () => {
    // Navigation and error
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Form states
    const [visaType, setVisaType] = useState('');
    const [formData, setFormData] = useState({});
    const [preferredIndustry, setPreferredIndustry] = useState('');

    // Location and data
    const location = useLocation();
    const locationData = location.state?.data;
    const [prefillData, setPrefillData] = useState(''); // TODO: Abdul, your data is in this variable, work on prefilling with this - Alex.

    // Check to see if logged in
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login'); // Adjust the URL if needed
            console.log(response);
            if (response.data.type == "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
        } catch (err) {
        } finally {
        }
    };

    // Fetch data when the component mounts
    const checkPrefill = async (e) => {
        if (location && locationData) { // if not null
            console.log('Previous Data exists:', locationData);
            setPrefillData(locationData);
        } 
        else { // else it is null get stuff from database questionairre
            const response = await axios.get('/api/questionnaire');  // API call using axios
            console.log('Database data exists:', response.data.data.prefill_data);
            setPrefillData(response.data.data.prefill_data);
        }
    }

    // Handle form submission using axios to send form data to the backend
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/preview_results', formData);  // API call using axios
            console.log('Success:', response.data);
            if (response.status === 200) {
                console.log(sessionStorage.getItem('user_id'));
                navigate('/dashpreview', { state: { data: response.data } });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        // Debugging output to the console
        console.log({
            formData,
        });
    };

    // Function to update form data state
    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    useEffect(() => {
        fetchLogin();
        checkPrefill();
    }, []);

    return (
    <>
      <Navbar />
      {/* Form Container */}
      <Box maxW="75%" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="#F9FAFC" borderColor="#E2E8F0">
        <form onSubmit={handleFormSubmit}>

          {/* Visa Subclass Selection */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Which visa subclass are you applying for? 
              <Tooltip label="Select the visa category you are applying for." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <RadioGroup onChange={(value) => { setVisaType(value); updateFormData("visaType", value); }} value={visaType}>
              <Stack direction="column">
                <Radio value="189" fontSize="lg" color="gray.600">Skilled Independent Visa (Subclass 189)</Radio>
                <Radio value="190" fontSize="lg" color="gray.600">Skilled Nominated Visa (Subclass 190)</Radio>
                <Radio value="491" fontSize="lg" color="gray.600">Skilled Work Regional (Subclass 491)</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Age Selection */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Please select your age range at the time of invitation:
              <Tooltip label="Your age range when you receive your invitation." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select your age range" onChange={(e) => updateFormData("age", e.target.value)} fontSize="lg" color="gray.600">
              <option value="18-25">At least 18 but less than 25 years</option>
              <option value="25-33">At least 25 but less than 33 years</option>
              <option value="33-40">At least 33 but less than 40 years</option>
              <option value="40-45">At least 40 but less than 45 years</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* English Proficiency */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              What is your level of English proficiency?
              <Tooltip label="Select the level of English proficiency you possess." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select your English proficiency level" onChange={(e) => updateFormData("englishProficiency", e.target.value)} fontSize="lg" color="gray.600">
              <option value="competent">Competent English</option>
              <option value="proficient">Proficient English</option>
              <option value="superior">Superior English</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Overseas Skilled Employment Experience */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              How many years of skilled employment experience do you have outside of Australia in your nominated occupation (within the last 10 years)?
              <Tooltip label="Enter the number of years of skilled employment experience outside Australia." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select your overseas work experience" onChange={(e) => updateFormData("overseasExperience", e.target.value)} fontSize="lg" color="gray.600">
              <option value="0">Less than 3 years</option>
              <option value="3-5">At least 3 but less than 5 years</option>
              <option value="5-8">At least 5 but less than 8 years</option>
              <option value="8+">At least 8 years</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Australian Skilled Employment Experience */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              How many years of skilled employment experience do you have in Australia in your nominated occupation (within the last 10 years)?
              <Tooltip label="Enter the number of years of skilled employment experience in Australia." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select your Australian work experience" onChange={(e) => updateFormData("australiaExperience", e.target.value)} fontSize="lg" color="gray.600">
              <option value="0">Less than 1 year</option>
              <option value="1-3">At least 1 but less than 3 years</option>
              <option value="3-5">At least 3 but less than 5 years</option>
              <option value="5-8">At least 5 but less than 8 years</option>
              <option value="8+">At least 8 years</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Australian Study Requirement */}
          <FormControl mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Have you met the Australian Study Requirement?
              <Tooltip label="Do you have at least 1 degree, diploma, or trade qualification from Australia?" fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select your Australian study status" onChange={(e) => updateFormData("australianStudy", e.target.value)} fontSize="lg" color="gray.600">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Specialist Education Qualification */}
          <FormControl mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Have you completed a Master's degree by research or Doctorate in STEM or ICT?
              <Tooltip label="Select if you've completed advanced degrees in Australia in the STEM or ICT fields." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select your specialist qualification status" onChange={(e) => updateFormData("specialistEducation", e.target.value)} fontSize="lg" color="gray.600">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Educational Qualification */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              What is your highest level of educational qualification?
              <Tooltip label="Select the highest level of educational qualification you possess." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select your highest qualification" onChange={(e) => updateFormData("education", e.target.value)} fontSize="lg" color="gray.600">
              <option value="phd">Doctorate (PhD or a Masters Degree by Research)</option>
              <option value="bachelor">Masters Degree by Coursework or a Bachelor’s Degree</option>
              <option value="diploma">Diploma/Trade Qualification</option>
              <option value="qualification">Qualification for Nominated Skilled Occupation</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Professional Year in Australia */}
          <FormControl mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Have you completed a Professional Year in Australia in Accounting, ICT, or Engineering?
              <Tooltip label="Have you completed a Professional Year in Australia in one of the fields?" fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select your professional year status" onChange={(e) => updateFormData("professionalYear", e.target.value)} fontSize="lg" color="gray.600">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Credentialled Community Language */}
          <FormControl mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Do you hold a recognised qualification in a credentialled community language?
              <Tooltip label="Select whether you hold a recognised credentialled community language qualification." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <RadioGroup onChange={(value) => updateFormData("communityLanguage", value)}>
              <Stack direction="column">
                <Radio value="yes" fontSize="lg" color="gray.600">Yes</Radio>
                <Radio value="no" fontSize="lg" color="gray.600">No</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Study in Regional Australia */}
          <FormControl mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Have you studied in a regional area of Australia and met the Australian study requirement?
              <Tooltip label="Select whether you have studied in a regional area of Australia." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <RadioGroup onChange={(value) => updateFormData("regionalStudy", value)}>
              <Stack direction="column">
                <Radio value="yes" fontSize="lg" color="gray.600">Yes</Radio>
                <Radio value="no" fontSize="lg" color="gray.600">No</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* State Preferred */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              State Preferred
              <Tooltip label="Select your preferred state in Australia." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select a state" onChange={(e) => updateFormData("statePreferred", e.target.value)} fontSize="lg" color="gray.600">
              <option value="NSW">New South Wales</option>
              <option value="VIC">Victoria</option>
              <option value="QLD">Queensland</option>
              <option value="WA">Western Australia</option>
              <option value="SA">South Australia</option>
              <option value="TAS">Tasmania</option>
              <option value="ACT">Australian Capital Territory</option>
              <option value="NT">Northern Territory</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Preferred Industry */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Preferred Industry
              <Tooltip label="Select your preferred industry." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select an industry" onChange={(e) => { setPreferredIndustry(e.target.value); updateFormData("preferredIndustry", e.target.value) }} fontSize="lg" color="gray.600">
              <option value="business">Business</option>
              <option value="it">IT</option>
              <option value="education">Education</option>
              <option value="engineering">Engineering</option>
              <option value="healthcare">Healthcare</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Preferred Level of Course */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Preferred Level of Course
              <Tooltip label="Select the level of course you want to pursue." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select a course level" onChange={(e) => updateFormData("courseLevel", e.target.value)} fontSize="lg" color="gray.600">
              <option value="postgraduate">Masters</option>
              <option value="undergraduate">Bachelors</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Preferred Course */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Preferred Course (based on industry and level)
              <Tooltip label="Select the preferred course based on the industry." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select a course" onChange={(e) => updateFormData("preferredCourse", e.target.value)} fontSize="lg" color="gray.600">
              {preferredIndustry === 'business' && <option value="accounting">Accounting</option>}
              {preferredIndustry === 'it' && <option value="softwareEngineering">Software Engineering</option>}
              {preferredIndustry === 'education' && <option value="teaching">Teaching</option>}
              {preferredIndustry === 'engineering' && <option value="civilEngineering">Civil Engineering</option>}
              {preferredIndustry === 'healthcare' && <option value="nursing">Nursing</option>}
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Preferred Occupation */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Preferred Occupation (based on industry)
              <Tooltip label="Select your preferred occupation." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select placeholder="Select an occupation" onChange={(e) => updateFormData("preferredOccupation", e.target.value)} fontSize="lg" color="gray.600">
              {preferredIndustry === 'business' && <option value="263112">Business Analyst</option>}
              {preferredIndustry === 'it' && <option value="263112">Software Developer</option>}
              {preferredIndustry === 'education' && <option value="263112">Teacher</option>}
              {preferredIndustry === 'engineering' && <option value="263112">Civil Engineer</option>}
              {preferredIndustry === 'healthcare' && <option value="263112">Nurse</option>}
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Marital Status */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              What is your marital status?
              <Tooltip label="Select your current marital status." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select onChange={(e) => updateFormData("maritalStatus", e.target.value)} placeholder="Select your marital status" fontSize="lg" color="gray.600">
              <option value="single">Single or partner is an Australian citizen/ permanent resident</option>
              <option value="married_skilled">Married and partner meets age, English, and skill criteria</option>
              <option value="married_unskilled">Married and partner has competent English</option>
            </Select>
          </FormControl>
          <Divider my={4} borderColor="gray.300" />

          {/* Nomination */}
          <FormControl isRequired mb={4}>
            <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
              Have you been invited to apply for a Skilled Nominated visa (subclass 190)?
              <Tooltip label="Select whether you've received an invitation for subclass 190." fontSize="md">
                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
              </Tooltip>
            </FormLabel>
            <Select onChange={(e) => updateFormData("nomination", e.target.value)} placeholder="Select your nomination status" fontSize="lg" color="gray.600">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FormControl>

                    {/* Submit Button */}
                    <Button mt={6} colorScheme="teal" type="submit">
                        Preview Results
                    </Button>
                </form>
            </Box>
        </>
    );
};

export default Questionnaire;
