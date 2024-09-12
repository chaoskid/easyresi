import React, { useState } from "react";
import {
  Box, FormControl, FormLabel, Select, RadioGroup, Radio, Checkbox,
  Button, Stack, NumberInput, NumberInputField, CheckboxGroup, Text
} from '@chakra-ui/react';

const Questionairre = () => {
  const [visaType, setVisaType] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [spouseSkilled, setSpouseSkilled] = useState('');
  const [formData, setFormData] = useState({});
  const [preferredIndustry, setPreferredIndustry] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log({
      visaType,
      maritalStatus,
      spouseSkilled,
      preferredIndustry,
      ...formData
    });
  };

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Box maxW="600px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
      <form onSubmit={handleFormSubmit}>

        {/* Visa Subclass Selection */}
        <FormControl isRequired mb={4}>
          <FormLabel>Which visa subclass are you applying for?</FormLabel>
          <RadioGroup onChange={setVisaType} value={visaType}>
            <Stack direction="row">
              <Radio value="189">Skilled Independent Visa (Subclass 189)</Radio>
              <Radio value="190">Skilled Nominated Visa (Subclass 190)</Radio>
              <Radio value="491">Skilled Work Regional (Subclass 491)</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {/* Age */}
        <FormControl isRequired mb={4}>
          <FormLabel>Please select your age range at the time of invitation:</FormLabel>
          <Select placeholder="Select your age range" onChange={(e) => updateFormData("age", e.target.value)}>
            <option value="18-25">At least 18 but less than 25 years</option>
            <option value="25-33">At least 25 but less than 33 years</option>
            <option value="33-40">At least 33 but less than 40 years</option>
            <option value="40-45">At least 40 but less than 45 years</option>
          </Select>
        </FormControl>

        {/* English Proficiency */}
        <FormControl isRequired mb={4}>
          <FormLabel>What is your level of English proficiency?</FormLabel>
          <Select placeholder="Select your English proficiency level" onChange={(e) => updateFormData("englishProficiency", e.target.value)}>
            <option value="competent">Competent English</option>
            <option value="proficient">Proficient English</option>
            <option value="superior">Superior English</option>
          </Select>
        </FormControl>

        {/* Overseas Skilled Employment Experience */}
        <FormControl isRequired mb={4}>
          <FormLabel>How many years of skilled employment experience do you have outside of Australia in your nominated occupation (within the last 10 years)?</FormLabel>
          <Select placeholder="Select your overseas work experience" onChange={(e) => updateFormData("overseasExperience", e.target.value)}>
            <option value="0">Less than 3 years</option>
            <option value="3-5">At least 3 but less than 5 years</option>
            <option value="5-8">At least 5 but less than 8 years</option>
            <option value="8+">At least 8 years</option>
          </Select>
        </FormControl>

        {/* Australian Skilled Employment Experience */}
        <FormControl isRequired mb={4}>
          <FormLabel>How many years of skilled employment experience do you have in Australia in your nominated occupation (within the last 10 years)?</FormLabel>
          <Select placeholder="Select your Australian work experience" onChange={(e) => updateFormData("australiaExperience", e.target.value)}>
            <option value="0">Less than 1 year</option>
            <option value="1-3">At least 1 but less than 3 years</option>
            <option value="3-5">At least 3 but less than 5 years</option>
            <option value="5-8">At least 5 but less than 8 years</option>
            <option value="8+">At least 8 years</option>
          </Select>
        </FormControl>

        {/* Educational Qualification */}
        <FormControl isRequired mb={4}>
          <FormLabel>What is your highest level of educational qualification?</FormLabel>
          <Select placeholder="Select your highest qualification" onChange={(e) => updateFormData("education", e.target.value)}>
            <option value="phd">Doctorate (PhD)</option>
            <option value="bachelor">Bachelor’s Degree</option>
            <option value="diploma">Diploma/Trade Qualification</option>
            <option value="qualification">Qualification for Nominated Skilled Occupation</option>
          </Select>
        </FormControl>

        {/* Specialist Education Qualification */}
        <FormControl mb={4}>
          <FormLabel>Have you completed a Master’s degree by research or Doctorate from an Australian educational institution in the fields of science, technology, engineering, mathematics, or ICT?</FormLabel>
          <Select placeholder="Select your specialist qualification status" onChange={(e) => updateFormData("specialistEducation", e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </FormControl>

        {/* Australian Study Requirement */}
        <FormControl mb={4}>
          <FormLabel>Have you met the Australian Study Requirement (at least 1 degree, diploma, or trade qualification obtained while living and studying in Australia)?</FormLabel>
          <Select placeholder="Select your Australian study status" onChange={(e) => updateFormData("australianStudy", e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </FormControl>

        {/* Professional Year in Australia */}
        <FormControl mb={4}>
          <FormLabel>Have you completed a Professional Year in Australia in Accounting, ICT, or Engineering?</FormLabel>
          <Select placeholder="Select your professional year status" onChange={(e) => updateFormData("professionalYear", e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </FormControl>

        {/* Credentialled Community Language */}
        <FormControl mb={4}>
          <FormLabel>Do you hold a recognised qualification in a credentialled community language?</FormLabel>
          <CheckboxGroup onChange={(value) => updateFormData("communityLanguage", value)}>
            <Stack direction="row">
              <Checkbox value="bilingual">Bilingual</Checkbox>
              <Checkbox value="trilingual">Trilingual</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>

        {/* Study in Regional Australia */}
        <FormControl mb={4}>
          <Checkbox onChange={(e) => updateFormData("regionalStudy", e.target.checked)}>
            Have you studied in a regional area of Australia and met the Australian study requirement?
          </Checkbox>
          <Text fontSize="sm" color="red.500">
            *You must have lived and studied in a designated regional area to claim these points.
          </Text>
        </FormControl>

        {/* State Preferred */}
        <FormControl isRequired mb={4}>
          <FormLabel>State Preferred</FormLabel>
          <Select placeholder="Select a state" onChange={(e) => updateFormData("statePreferred", e.target.value)}>
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

        {/* Preferred Industry */}
        <FormControl isRequired mb={4}>
          <FormLabel>Preferred Industry</FormLabel>
          <Select placeholder="Select an industry" onChange={(e) => setPreferredIndustry(e.target.value)}>
            <option value="business">Business (ANZCO starts with '22')</option>
            <option value="it">IT (ANZCO starts with '26')</option>
            <option value="education">Education (ANZCO starts with '24')</option>
            <option value="engineering">Engineering (ANZCO starts with '312')</option>
            <option value="healthcare">Healthcare (ANZCO starts with '25')</option>
          </Select>
        </FormControl>

        {/* Preferred Level of Course */}
        <FormControl isRequired mb={4}>
          <FormLabel>Preferred Level of Course</FormLabel>
          <Select placeholder="Select a course level" onChange={(e) => updateFormData("courseLevel", e.target.value)}>
            <option value="masters">Masters</option>
            <option value="bachelors">Bachelors</option>
            <option value="diploma">Diploma</option>
          </Select>
        </FormControl>

        {/* Preferred Course */}
        <FormControl isRequired mb={4}>
          <FormLabel>Preferred Course (based on industry and level)</FormLabel>
          <Select placeholder="Select a course" onChange={(e) => updateFormData("preferredCourse", e.target.value)}>
            {/* Dynamically load courses based on the selected industry and level */}
            {preferredIndustry === 'business' && <option value="accounting">Accounting</option>}
            {preferredIndustry === 'it' && <option value="softwareEngineering">Software Engineering</option>}
            {preferredIndustry === 'education' && <option value="teaching">Teaching</option>}
            {preferredIndustry === 'engineering' && <option value="civilEngineering">Civil Engineering</option>}
            {preferredIndustry === 'healthcare' && <option value="nursing">Nursing</option>}
          </Select>
        </FormControl>

        {/* Preferred Occupation */}
        <FormControl isRequired mb={4}>
          <FormLabel>Preferred Occupation (based on industry)</FormLabel>
          <Select placeholder="Select an occupation" onChange={(e) => updateFormData("preferredOccupation", e.target.value)}>
            {preferredIndustry === 'business' && <option value="businessAnalyst">Business Analyst</option>}
            {preferredIndustry === 'it' && <option value="softwareDeveloper">Software Developer</option>}
            {preferredIndustry === 'education' && <option value="teacher">Teacher</option>}
            {preferredIndustry === 'engineering' && <option value="civilEngineer">Civil Engineer</option>}
            {preferredIndustry === 'healthcare' && <option value="nurse">Nurse</option>}
          </Select>
        </FormControl>

        {/* Marital Status */}
        <FormControl isRequired mb={4}>
          <FormLabel>What is your marital status?</FormLabel>
          <Select onChange={(e) => setMaritalStatus(e.target.value)} placeholder="Select your marital status">
            <option value="single">Single</option>
            <option value="married">Married/De facto partner</option>
          </Select>
        </FormControl>

        {/* Partner Skills */}
        {maritalStatus === 'married' && (
          <FormControl isRequired mb={4}>
            <FormLabel>If married or de facto, does your partner meet the age, English language, and skilled employment criteria?</FormLabel>
            <Select onChange={(e) => updateFormData("spouseSkills", e.target.value)} placeholder="Select partner's skills status">
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="english">Partner has Competent English only</option>
            </Select>
          </FormControl>
        )}

        {/* Submit Button */}
        <Button mt={6} colorScheme="teal" type="submit">
          Submit Questionnaire
        </Button>
      </form>
    </Box>
  );
};

export default Questionairre;


