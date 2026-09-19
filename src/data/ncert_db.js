/**
 * NCERT Pre-Connected Curriculum Database (Classes 4-10)
 * 
 * Provides structured 2-way outcome-based learning modules for OPED.
 */

export const NCERT_DATABASE = [
  {
    id: "ncert-c6-sci-ch2",
    classNum: 6,
    subject: "Science",
    chapterNo: 2,
    title: "Components of Food",
    queryKeywords: ["ncert class 6 science chapter 2", "class 6 components of food", "class 6 science ch 2", "components of food"],
    summary: "Nutrients required by human body, balance diet, deficiency diseases.",
    modules: [
      {
        id: "m1",
        title: "Major Nutrients in Food",
        understanding: {
          teacherSpeech: "Food contains major nutrients essential for growth and energy: Carbohydrates, Proteins, Fats, Vitamins, and Minerals. Carbohydrates and Fats primarily provide energy to our body.",
          blackboardContent: {
            heading: "Major Nutrients",
            bulletPoints: [
              "Carbohydrates: Energy-giving food (Rice, Wheat, Potato)",
              "Fats: High energy reserves (Butter, Nuts, Oil)",
              "Proteins: Bodybuilding nutrients (Pulses, Milk, Fish)",
              "Vitamins & Minerals: Disease protection"
            ],
            formula: "Energy = Carbohydrates + Fats | Growth = Proteins",
            imageTag: "Nutrient Pyramid Diagram"
          }
        },
        recitationTarget: "Carbohydrates and fats mainly provide energy to our body, while proteins are needed for growth and repair of our body.",
        interactive3D: {
          has3D: true,
          type: "molecular_grid",
          title: "3D Glucose & Starch Molecular Structure",
          description: "Inspect the energy-yielding carbon-hydrogen-oxygen molecular bond of Carbohydrates."
        }
      },
      {
        id: "m2",
        title: "Deficiency Diseases",
        understanding: {
          teacherSpeech: "Diseases that occur due to lack of nutrients over a long period are called deficiency diseases. For instance, Vitamin A deficiency causes Night Blindness, while Iodine deficiency causes Goitre.",
          blackboardContent: {
            heading: "Deficiency Table",
            bulletPoints: [
              "Vitamin A -> Night Blindness (Poor vision)",
              "Vitamin B1 -> Beriberi (Weak muscles)",
              "Vitamin C -> Scurvy (Bleeding gums)",
              "Iodine -> Goitre (Swollen neck gland)"
            ],
            formula: "Lack of Nutrients + Prolonged Time = Deficiency Disease",
            imageTag: "Thyroid & Goitre Medical Chart"
          }
        },
        recitationTarget: "Diseases that occur due to lack of nutrients over a long period are called deficiency diseases.",
        interactive3D: {
          has3D: false
        }
      }
    ]
  },
  {
    id: "ncert-c8-sci-ch11",
    classNum: 8,
    subject: "Science",
    chapterNo: 11,
    title: "Force and Pressure",
    queryKeywords: ["ncert class 8 science chapter 11", "class 8 force and pressure", "force and pressure class 8"],
    summary: "Push or pull on an object, contact & non-contact forces, pressure equation.",
    modules: [
      {
        id: "m1",
        title: "Concept of Force & Vector Nature",
        understanding: {
          teacherSpeech: "A push or pull on an object is called a force. Force can change the state of motion of an object, its speed, or its direction.",
          blackboardContent: {
            heading: "Definition of Force",
            bulletPoints: [
              "Interaction between two objects results in a force",
              "Forces applied in the same direction add to one another",
              "SI Unit of Force = Newton (N)"
            ],
            formula: "Force (F) = Mass (m) × Acceleration (a)",
            imageTag: "Tug-of-war Vector Diagram"
          }
        },
        recitationTarget: "A push or a pull on an object resulting from its interaction with another object is called a force.",
        interactive3D: {
          has3D: true,
          type: "vector_cube",
          title: "3D Physics Force & Velocity Vector Simulator",
          description: "Interact with 3D force vectors acting on a block from multiple angles."
        }
      },
      {
        id: "m2",
        title: "Pressure Equation & Area Inverse Relation",
        understanding: {
          teacherSpeech: "Pressure is the force acting per unit area of a surface. The smaller the area, the larger the pressure on a surface for the same force.",
          blackboardContent: {
            heading: "Pressure Formula",
            bulletPoints: [
              "Pressure = Force / Area on which it acts",
              "SI Unit = Pascal (Pa) or N/m²",
              "Sharper knives have smaller surface area, producing high pressure"
            ],
            formula: "P = F / A",
            imageTag: "High vs Low Area Pressure Diagram"
          }
        },
        recitationTarget: "Pressure is defined as the force acting per unit area of a surface.",
        interactive3D: {
          has3D: true,
          type: "pressure_chamber",
          title: "3D Hydraulic Pressure Chamber Simulation",
          description: "Observe liquid pressure distribution in a 3D closed cylinder."
        }
      }
    ]
  },
  {
    id: "ncert-c10-sci-ch10",
    classNum: 10,
    subject: "Science",
    chapterNo: 10,
    title: "Light - Reflection and Refraction",
    queryKeywords: ["ncert class 10 science chapter 10", "class 10 light reflection and refraction", "light class 10"],
    summary: "Laws of reflection, spherical mirrors, lens formula, refractive index.",
    modules: [
      {
        id: "m1",
        title: "Laws of Reflection & Spherical Mirrors",
        understanding: {
          teacherSpeech: "Light travels in straight lines. The angle of incidence is always equal to the angle of reflection, and the incident ray, normal, and reflected ray all lie in the same plane.",
          blackboardContent: {
            heading: "Laws of Reflection",
            bulletPoints: [
              "1. Angle of incidence (∠i) = Angle of reflection (∠r)",
              "2. Incident ray, normal, and reflected ray lie in same plane",
              "Concave mirror: Converging | Convex mirror: Diverging"
            ],
            formula: "∠i = ∠r  |  f = R / 2",
            imageTag: "Ray Diagram Concave Mirror"
          }
        },
        recitationTarget: "The angle of incidence is equal to the angle of reflection, and the incident ray, normal, and reflected ray all lie in the same plane.",
        interactive3D: {
          has3D: true,
          type: "optics_lens",
          title: "3D Interactive Concave Mirror & Optics Ray Bench",
          description: "Drag light source in 3D to observe real vs virtual image formation."
        }
      }
    ]
  },
  {
    id: "ncert-c4-env-ch1",
    classNum: 4,
    subject: "EVS",
    chapterNo: 1,
    title: "Going to School",
    queryKeywords: ["ncert class 4 evs chapter 1", "class 4 going to school", "going to school class 4"],
    summary: "Bridges, bamboo bridges, trolley, camel cart transport across Indian terrains.",
    modules: [
      {
        id: "m1",
        title: "Bridges & Transport Systems",
        understanding: {
          teacherSpeech: "Children in Assam use bamboo and rope bridges to reach school. In Ladakh, children use a trolley suspended over a river.",
          blackboardContent: {
            heading: "Modes of Reaching School",
            bulletPoints: [
              "Assam: Bamboo bridge over swollen rivers",
              "Ladakh: Iron rope trolley over wide rivers",
              "Rajasthan: Camel cart through hot sand"
            ],
            formula: "Adaptation + Resilience = Education Journey",
            imageTag: "Bamboo Bridge Illustration"
          }
        },
        recitationTarget: "In Assam, bamboo and rope bridges are built to cross rivers because it rains heavily.",
        interactive3D: {
          has3D: true,
          type: "bridge_model",
          title: "3D Suspension & Bamboo Bridge Model",
          description: "Inspect tension cables and structural bamboo joints in 3D."
        }
      }
    ]
  }
];

/**
 * Normalizes and matches search queries against NCERT DB
 */
export function searchNcertDatabase(query) {
  if (!query || typeof query !== "string") return { matched: false };
  
  const clean = query.trim().toLowerCase();
  
  // 1. Direct keyword match
  const match = NCERT_DATABASE.find(item => {
    return item.queryKeywords.some(kw => clean.includes(kw.toLowerCase())) ||
           clean.includes(`class ${item.classNum}`) && clean.includes(item.title.toLowerCase()) ||
           clean.includes(`chapter ${item.chapterNo}`) && clean.includes(`class ${item.classNum}`);
  });

  if (match) {
    return { matched: true, data: match };
  }

  // 2. Out of scope response
  return {
    matched: false,
    outOfScopeMessage: "We are expanding! Try typing NCERT [class] [subject] [chapter no]\nExample: NCERT Class 6 Science Chapter 2"
  };
}
