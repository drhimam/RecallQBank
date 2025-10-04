const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Question = require('./models/Question');
const dotenv = require('dotenv');

dotenv.config();

const users = [
  {
    username: 'dr_smith',
    email: 'smith@example.com',
    password: 'password123',
    role: 'moderator',
    specialty: 'Cardiology',
  },
  {
    username: 'dr_johnson',
    email: 'johnson@example.com',
    password: 'password123',
    role: 'moderator',
    specialty: 'Nephrology',
  },
  {
    username: 'dr_williams',
    email: 'williams@example.com',
    password: 'password123',
    role: 'contributor',
    specialty: 'Neurology',
  },
  {
    username: 'dr_brown',
    email: 'brown@example.com',
    password: 'password123',
    role: 'contributor',
    specialty: 'Medicine',
  },
];

const questions = [
  {
    question: "A 65-year-old man presents with chest pain and shortness of breath that started 2 hours ago. He has a history of hypertension and type 2 diabetes. On examination, his blood pressure is 160/95 mmHg, heart rate is 110 bpm, and respiratory rate is 22/min. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most appropriate immediate management?",
    options: new Map([
      ['A', "Administer sublingual nitroglycerin and aspirin"],
      ['B', "Perform urgent coronary angiography"],
      ['C', "Start heparin infusion"],
      ['D', "Give beta-blocker to control heart rate"]
    ]),
    correctAnswers: ['B'],
    explanation: "In a patient with STEMI (ST-elevation myocardial infarction), the most appropriate immediate management is urgent coronary angiography with possible percutaneous coronary intervention (PCI). This is the definitive treatment for STEMI and should be performed within 90 minutes of first medical contact if possible. While aspirin and nitroglycerin are important initial treatments, they are not the definitive management. Heparin may be used as an adjunct, and beta-blockers are not first-line for immediate management in STEMI.",
    discussion: "STEMI is a medical emergency requiring immediate reperfusion therapy. Primary PCI is preferred over fibrinolytic therapy when available within 90-120 minutes. Door-to-balloon time should be less than 90 minutes. Time is muscle - the sooner reperfusion occurs, the better the outcome.",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["Chest Pain", "Acute Coronary Syndrome"],
    tags: ["ECG", "Emergency"],
    status: "approved"
  },
  {
    question: "Which of the following is NOT a feature of nephrotic syndrome?",
    options: new Map([
      ['A', "Proteinuria > 3.5g/day"],
      ['B', "Hypoalbuminemia"],
      ['C', "Hyperlipidemia"],
      ['D', "Hematuria"]
    ]),
    correctAnswers: ['D'],
    explanation: "Nephrotic syndrome is characterized by the classic triad of heavy proteinuria (>3.5g/day), hypoalbuminemia, and edema. Hyperlipidemia is also commonly present due to increased hepatic lipoprotein synthesis. Hematuria, however, is not a feature of nephrotic syndrome but rather of nephritic syndrome, which is characterized by hematuria, hypertension, and reduced glomerular filtration rate.",
    discussion: "Nephrotic syndrome results from increased glomerular permeability to proteins. The primary defect is in the glomerular basement membrane or podocyte structure. Common causes include minimal change disease (in children), focal segmental glomerulosclerosis, and membranous nephropathy (in adults).",
    exam: "FCPS",
    subject: "Nephrology",
    topics: ["Renal", "Proteinuria"],
    tags: ["Urine", "Lab"],
    status: "approved"
  },
  {
    question: "Management of acute myocardial infarction includes all EXCEPT:",
    options: new Map([
      ['A', "Aspirin"],
      ['B', "Nitroglycerin"],
      ['C', "Beta-blockers"],
      ['D', "Calcium channel blockers"]
    ]),
    correctAnswers: ['D'],
    explanation: "Calcium channel blockers are not routinely used in the acute management of myocardial infarction and may actually be harmful in some cases. Aspirin is an antiplatelet agent that is essential in MI management. Nitroglycerin helps with chest pain and reduces preload. Beta-blockers reduce myocardial oxygen demand and are beneficial in MI.",
    discussion: "The management of acute MI focuses on rapid reperfusion, pain relief, and reducing myocardial oxygen demand. Modern treatment includes dual antiplatelet therapy (aspirin plus a P2Y12 inhibitor), anticoagulation, and prompt reperfusion either by primary PCI or fibrinolysis.",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["MI", "Emergency"],
    tags: ["Pharmacology"],
    status: "approved"
  },
  {
    question: "A patient presents with sudden onset severe headache described as 'the worst headache of my life'. Which investigation is most appropriate?",
    options: new Map([
      ['A', "CT scan of the head without contrast"],
      ['B', "MRI of the brain"],
      ['C', "Lumbar puncture"],
      ['D', "CT angiography"]
    ]),
    correctAnswers: ['A'],
    explanation: "In a patient presenting with sudden onset severe headache ('thunderclap headache'), the immediate concern is subarachnoid hemorrhage (SAH). Non-contrast CT scan of the head is the first-line investigation as it is highly sensitive for detecting SAH, especially within the first 6 hours of symptom onset. If CT is negative but clinical suspicion remains high, lumbar puncture should be performed.",
    discussion: "Thunderclap headache is a medical emergency that requires immediate evaluation. Other causes include reversible cerebral vasoconstriction syndrome, cerebral venous sinus thrombosis, and pituitary apoplexy. The classic presentation of SAH is a sudden, severe headache that reaches maximum intensity within seconds to minutes.",
    exam: "USMLE",
    subject: "Neurology",
    topics: ["Headache", "Emergency"],
    tags: ["Imaging"],
    status: "approved"
  },
  {
    question: "Which of the following is the most common cause of chronic kidney disease?",
    options: new Map([
      ['A', "Diabetic nephropathy"],
      ['B', "Hypertensive nephrosclerosis"],
      ['C', "Glomerulonephritis"],
      ['D', "Polycystic kidney disease"]
    ]),
    correctAnswers: ['A'],
    explanation: "Diabetic nephropathy is the leading cause of chronic kidney disease and end-stage renal disease in developed countries. It results from long-standing diabetes mellitus and is characterized by progressive albuminuria, declining GFR, and hypertension.",
    discussion: "The pathogenesis involves hyperglycemia-induced damage to the glomerular basement membrane and mesangial cells. Early detection and tight glycemic control can slow progression.",
    exam: "USMLE",
    subject: "Nephrology",
    topics: ["Chronic Kidney Disease", "Diabetes"],
    tags: ["Pathophysiology"],
    status: "approved"
  },
  {
    question: "A 45-year-old woman presents with fatigue, weight gain, and cold intolerance. Laboratory tests show elevated TSH and low free T4. What is the most likely diagnosis?",
    options: new Map([
      ['A', "Graves' disease"],
      ['B', "Hashimoto's thyroiditis"],
      ['C', "Thyroid adenoma"],
      ['D', "Subacute thyroiditis"]
    ]),
    correctAnswers: ['B'],
    explanation: "Hashimoto's thyroiditis is the most common cause of hypothyroidism. It is an autoimmune condition characterized by lymphocytic infiltration of the thyroid gland, leading to gradual destruction and decreased hormone production. The clinical presentation includes fatigue, weight gain, cold intolerance, and dry skin.",
    discussion: "Diagnosis is confirmed by elevated TSH, low free T4, and presence of anti-thyroid peroxidase (TPO) antibodies. Treatment involves lifelong levothyroxine replacement.",
    exam: "MRCP",
    subject: "Endocrinology",
    topics: ["Thyroid Disorders", "Autoimmune Disease"],
    tags: ["Lab Values"],
    status: "approved"
  },
  {
    question: "Which of the following medications is most likely to cause drug-induced lupus?",
    options: new Map([
      ['A', "Ibuprofen"],
      ['B', "Hydralazine"],
      ['C', "Methotrexate"],
      ['D', "Prednisone"]
    ]),
    correctAnswers: ['B'],
    explanation: "Hydralazine is a well-known cause of drug-induced lupus erythematosus (DILE). Other common culprits include procainamide, isoniazid, and minocycline. DILE typically presents with antinuclear antibodies (ANA) and anti-histone antibodies but usually lacks anti-dsDNA antibodies.",
    discussion: "The condition usually resolves after discontinuation of the offending drug. Symptoms may include arthralgias, myalgias, fever, and serositis.",
    exam: "USMLE",
    subject: "Rheumatology",
    topics: ["Autoimmune Disease", "Pharmacology"],
    tags: ["Drug Side Effects"],
    status: "approved"
  },
  {
    question: "A 30-year-old man presents with sudden onset of severe chest pain radiating to the back. His blood pressure is 180/100 mmHg in the right arm and 140/90 mmHg in the left arm. What is the most likely diagnosis?",
    options: new Map([
      ['A', "Pulmonary embolism"],
      ['B', "Aortic dissection"],
      ['C', "Myocardial infarction"],
      ['D', "Pneumothorax"]
    ]),
    correctAnswers: ['B'],
    explanation: "Aortic dissection should be suspected in patients with severe, tearing chest pain that radiates to the back, especially when there is a significant difference in blood pressure between arms. This difference occurs because the dissection may involve the subclavian artery.",
    discussion: "Other clinical features may include pulse deficits, neurological symptoms, and murmurs of aortic regurgitation. CT angiography is the diagnostic modality of choice.",
    exam: "MRCP",
    subject: "Cardiology",
    topics: ["Aortic Disorders", "Emergency Medicine"],
    tags: ["Physical Exam"],
    status: "approved"
  },
  {
    question: "Which of the following is a major criterion for rheumatic fever according to the Jones criteria?",
    options: new Map([
      ['A', "Arthralgia"],
      ['B', "Fever"],
      ['C', "Erythema marginatum"],
      ['D', "Prolonged PR interval"]
    ]),
    correctAnswers: ['C'],
    explanation: "The Jones criteria for rheumatic fever include major criteria (carditis, polyarthritis, chorea, erythema marginatum, subcutaneous nodules) and minor criteria (fever, arthralgia, elevated acute phase reactants, prolonged PR interval). The presence of two major criteria or one major and two minor criteria, along with evidence of preceding streptococcal infection, confirms the diagnosis.",
    discussion: "Rheumatic fever is a delayed immune response to group A streptococcal pharyngitis that primarily affects children. It can lead to rheumatic heart disease if not treated properly.",
    exam: "FCPS",
    subject: "Rheumatology",
    topics: ["Infectious Disease", "Pediatrics"],
    tags: ["Diagnostic Criteria"],
    status: "approved"
  },
  {
    question: "A 55-year-old man with a history of smoking presents with hemoptysis and weight loss. A chest X-ray shows a mass in the right upper lobe. Which of the following is the most likely diagnosis?",
    options: new Map([
      ['A', "Pneumonia"],
      ['B', "Lung cancer"],
      ['C', "Tuberculosis"],
      ['D', "Pulmonary embolism"]
    ]),
    correctAnswers: ['B'],
    explanation: "In a 55-year-old smoker presenting with hemoptysis, weight loss, and a lung mass, lung cancer (particularly non-small cell lung cancer) is the most likely diagnosis. Smoking is the primary risk factor for lung cancer.",
    discussion: "Other symptoms may include cough, dyspnea, and chest pain. Diagnosis is confirmed with tissue biopsy, and staging is performed with CT, PET scan, and possibly MRI.",
    exam: "USMLE",
    subject: "Pulmonology",
    topics: ["Oncology", "Smoking-Related Disease"],
    tags: ["Risk Factors"],
    status: "approved"
  },
  {
    question: "Which of the following is the most common cause of community-acquired pneumonia in adults?",
    options: new Map([
      ['A', "Streptococcus pneumoniae"],
      ['B', "Haemophilus influenzae"],
      ['C', "Mycoplasma pneumoniae"],
      ['D', "Legionella pneumophila"]
    ]),
    correctAnswers: ['A'],
    explanation: "Streptococcus pneumoniae (pneumococcus) is the most common bacterial cause of community-acquired pneumonia in adults. It typically presents with acute onset of fever, chills, cough, and pleuritic chest pain.",
    discussion: "Treatment is with beta-lactam antibiotics (penicillin, amoxicillin) or macrolides for penicillin-allergic patients. Vaccination with pneumococcal vaccine is recommended for high-risk individuals.",
    exam: "MRCP",
    subject: "Infectious Disease",
    topics: ["Respiratory Infections", "Bacteriology"],
    tags: ["Antibiotics"],
    status: "approved"
  },
  {
    question: "A 25-year-old woman presents with painful, red nodules on her shins. She recently had a respiratory infection. What is the most likely diagnosis?",
    options: new Map([
      ['A', "Cellulitis"],
      ['B', "Erythema nodosum"],
      ['C', "Lipoma"],
      ['D', "Hematoma"]
    ]),
    correctAnswers: ['B'],
    explanation: "Erythema nodosum presents as tender, red, subcutaneous nodules, typically on the shins. It is often associated with infections (especially streptococcal), inflammatory bowel disease, and sarcoidosis.",
    discussion: "The condition is more common in women and usually resolves spontaneously within 3-6 weeks. Treatment focuses on addressing the underlying cause and symptomatic relief with NSAIDs.",
    exam: "FCPS",
    subject: "Dermatology",
    topics: ["Skin Lesions", "Inflammatory Conditions"],
    tags: ["Physical Exam"],
    status: "approved"
  },
  {
    question: "Which of the following is the most common cause of acute pancreatitis?",
    options: new Map([
      ['A', "Alcohol abuse"],
      ['B', "Gallstones"],
      ['C', "Medications"],
      ['D', "Trauma"]
    ]),
    correctAnswers: ['B'],
    explanation: "Gallstones are the most common cause of acute pancreatitis, accounting for approximately 40-70% of cases. The mechanism involves obstruction of the pancreatic duct by a stone lodged in the ampulla of Vater.",
    discussion: "Alcohol is the second most common cause. Clinical features include severe epigastric pain radiating to the back, nausea, and vomiting. Diagnosis is confirmed by elevated lipase or amylase levels.",
    exam: "USMLE",
    subject: "Gastroenterology",
    topics: ["Abdominal Pain", "Biliary Disease"],
    tags: ["Pathophysiology"],
    status: "approved"
  },
  {
    question: "A 40-year-old man presents with progressive weakness and difficulty swallowing. Physical examination reveals proximal muscle weakness and a heliotrope rash. What is the most likely diagnosis?",
    options: new Map([
      ['A', "Myasthenia gravis"],
      ['B', "Dermatomyositis"],
      ['C', "Polymyositis"],
      ['D', "Lambert-Eaton syndrome"]
    ]),
    correctAnswers: ['B'],
    explanation: "Dermatomyositis is characterized by proximal muscle weakness and distinctive skin manifestations, including heliotrope rash (violaceous erythema of the eyelids) and Gottron's papules. It is an inflammatory myopathy with autoimmune features.",
    discussion: "Diagnosis is confirmed by elevated muscle enzymes (CK, aldolase), electromyography, and muscle biopsy. Treatment involves corticosteroids and immunosuppressive agents.",
    exam: "MRCP",
    subject: "Rheumatology",
    topics: ["Autoimmune Disease", "Neuromuscular Disorders"],
    tags: ["Skin Manifestations"],
    status: "approved"
  },
  {
    question: "Which of the following is the most common cause of chronic liver disease in the United States?",
    options: new Map([
      ['A', "Hepatitis B virus"],
      ['B', "Hepatitis C virus"],
      ['C', "Alcoholic liver disease"],
      ['D', "Non-alcoholic fatty liver disease"]
    ]),
    correctAnswers: ['D'],
    explanation: "Non-alcoholic fatty liver disease (NAFLD) is the most common cause of chronic liver disease in the United States, affecting up to 25% of the population. It is associated with obesity, insulin resistance, and metabolic syndrome.",
    discussion: "NAFLD encompasses a spectrum from simple steatosis to non-alcoholic steatohepatitis (NASH), which can progress to cirrhosis and hepatocellular carcinoma. Management focuses on lifestyle modifications and treating associated conditions.",
    exam: "USMLE",
    subject: "Hepatology",
    topics: ["Metabolic Disease", "Chronic Liver Disease"],
    tags: ["Epidemiology"],
    status: "approved"
  },
  {
    question: "A 35-year-old woman presents with fatigue, weight loss, and diarrhea. Laboratory tests show iron deficiency anemia. Which of the following is the most appropriate initial test?",
    options: new Map([
      ['A', "Colonoscopy"],
      ['B', "Upper endoscopy"],
      ['C', "Capsule endoscopy"],
      ['D', "CT enterography"]
    ]),
    correctAnswers: ['A'],
    explanation: "In a patient with iron deficiency anemia and diarrhea, colonoscopy is the most appropriate initial test to evaluate for colonic sources of bleeding such as angiodysplasia, inflammatory bowel disease, or malignancy.",
    discussion: "The approach to iron deficiency anemia involves evaluating both the upper and lower GI tracts. Colonoscopy should be performed first, followed by upper endoscopy if no source is found in the colon.",
    exam: "MRCP",
    subject: "Gastroenterology",
    topics: ["Anemia", "GI Bleeding"],
    tags: ["Diagnostic Approach"],
    status: "approved"
  },
  {
    question: "Which of the following is the most common cause of secondary hypertension?",
    options: new Map([
      ['A', "Renal artery stenosis"],
      ['B', "Primary aldosteronism"],
      ['C', "Pheochromocytoma"],
      ['D', "Cushing's syndrome"]
    ]),
    correctAnswers: ['B'],
    explanation: "Primary aldosteronism (Conn's syndrome) is the most common cause of secondary hypertension, accounting for approximately 5-10% of all hypertension cases. It results from autonomous aldosterone production, leading to sodium retention and potassium loss.",
    discussion: "Clinical features include hypertension, hypokalemia, and metabolic alkalosis. Diagnosis involves aldosterone-renin ratio testing and confirmatory suppression tests. Treatment is with mineralocorticoid receptor antagonists or surgical removal of aldosterone-producing adenomas.",
    exam: "FCPS",
    subject: "Nephrology",
    topics: ["Hypertension", "Endocrine Disorders"],
    tags: ["Lab Values"],
    status: "approved"
  },
  {
    question: "A 60-year-old man presents with painless jaundice, weight loss, and clay-colored stools. Imaging shows a mass in the head of the pancreas. What is the most likely diagnosis?",
    options: new Map([
      ['A', "Cholangiocarcinoma"],
      ['B', "Pancreatic adenocarcinoma"],
      ['C', "Gallbladder cancer"],
      ['D', "Metastatic liver disease"]
    ]),
    correctAnswers: ['B'],
    explanation: "Pancreatic adenocarcinoma, particularly of the head of the pancreas, commonly presents with painless jaundice due to biliary obstruction. Other symptoms include weight loss, clay-colored stools, and dark urine.",
    discussion: "Risk factors include smoking, diabetes, chronic pancreatitis, and family history. Prognosis is poor due to late presentation. Treatment options include surgical resection (Whipple procedure), chemotherapy, and radiation therapy.",
    exam: "USMLE",
    subject: "Oncology",
    topics: ["GI Malignancies", "Jaundice"],
    tags: ["Clinical Presentation"],
    status: "approved"
  },
  {
    question: "Which of the following is the most common cause of nephrotic syndrome in adults?",
    options: new Map([
      ['A', "Minimal change disease"],
      ['B', "Focal segmental glomerulosclerosis"],
      ['C', "Membranous nephropathy"],
      ['D', "Diabetic nephropathy"]
    ]),
    correctAnswers: ['C'],
    explanation: "Membranous nephropathy is the most common cause of nephrotic syndrome in adults. It is characterized by diffuse thickening of the glomerular basement membrane and subepithelial immune deposits.",
    discussion: "Primary membranous nephropathy is idiopathic, while secondary forms are associated with infections, medications, malignancies, and autoimmune diseases. Treatment depends on the severity and may include ACE inhibitors, immunosuppressive therapy, or supportive care.",
    exam: "MRCP",
    subject: "Nephrology",
    topics: ["Glomerular Disease", "Proteinuria"],
    tags: ["Pathology"],
    status: "approved"
  },
  {
    question: "A 28-year-old woman presents with recurrent episodes of severe headache, palpitations, and diaphoresis. Her blood pressure during an episode is 190/110 mmHg. What is the most likely diagnosis?",
    options: new Map([
      ['A', "Hyperthyroidism"],
      ['B', "Pheochromocytoma"],
      ['C', "Panic disorder"],
      ['D', "Renovascular hypertension"]
    ]),
    correctAnswers: ['B'],
    explanation: "Pheochromocytoma is a catecholamine-secreting tumor of the adrenal medulla that presents with episodic hypertension, headache, palpitations, and diaphoresis. These episodes are often triggered by stress, medications, or manipulation of the tumor.",
    discussion: "Diagnosis is confirmed by elevated plasma or urinary metanephrines. Imaging studies (CT, MRI) are used for localization. Treatment involves alpha-blockade followed by surgical resection.",
    exam: "FCPS",
    subject: "Endocrinology",
    topics: ["Adrenal Disorders", "Hypertension"],
    tags: ["Lab Values"],
    status: "approved"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/qbank', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany();
    await Question.deleteMany();

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users inserted');

    // Assign questions to users
    const contributors = createdUsers.filter(user => user.role === 'contributor');
    const moderators = createdUsers.filter(user => user.role === 'moderator');

    // Distribute questions among contributors
    const questionsWithUsers = questions.map((question, index) => {
      const contributor = contributors[index % contributors.length];
      const moderator = moderators[index % moderators.length];
      
      return {
        ...question,
        submittedBy: contributor._id,
        reviewedBy: question.status === 'approved' ? moderator._id : null
      };
    });

    // Insert questions
    await Question.insertMany(questionsWithUsers);
    console.log('Questions inserted');

    // Update user contribution counts
    for (const user of createdUsers) {
      const submittedCount = await Question.countDocuments({ submittedBy: user._id });
      const approvedCount = await Question.countDocuments({ 
        submittedBy: user._id, 
        status: 'approved' 
      });
      
      await User.findByIdAndUpdate(user._id, {
        contributions: submittedCount,
        approved: approvedCount,
        pending: submittedCount - approvedCount
      });
    }

    console.log('User contribution counts updated');
    console.log('Data seeding completed');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  seedData();
}