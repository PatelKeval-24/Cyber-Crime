// import body1 from "../assets/body1.jpg"
import Crimetypes from "./Crimetypes";
import icon from '../img/lock.png'

const Body1 = () => {
  return (
    <>
   
      <div className=' bg-[url("https://images.wallpapersden.com/image/download/cybersecurity-core_bmdrZ2mUmZqaraWkpJRmbmdsrWZlbWU.jpg")] bg-cover bg-center h-150 flex items-center justify-start'>
        <div className="">
          <div className="w-1/2 text-basee m-10 p-10 rounded-lg backdrop-blur-10 bg-gray-900/60 shadow-lg shadow-white/90">
            <h1 className="text-white text-6xl font-bold ">
              Welcome to the Crime Repository
            </h1>
            <h3 className="text-white text-lg mt-4">
              This platform allows individuals to report cyber and digital
              crimes in a secure and confidential manner. Our goal is to make
              crime reporting simple, accessible, and informative.
            </h3>
          </div>
          
        </div>
      </div>
      <h1 className="text-black p-2 text-4xl font-bold text-center bg-blue-600">Types of Cyber Crimes</h1>
      <div className=" h-180 ">
      <div className="grid grid-cols-2 justify-center p-10 gap-10 border-2   bg-gray-900 ">

       {
          attack.map(function (elem, idex){
            return <Crimetypes key={idex} attackName={elem.attackName}  about={elem.description}   />
          })
        }
     </div>

      </div>
    </>
  );
};

export default Body1;

const attack =
   [
    {
      "attackId": "AT001",
      "attackName": "Phishing Attack",
      "description": "Phishing attacks involve fake emails, messages, phone calls, or websites that appear to come from trusted sources. The goal is to trick users into revealing sensitive information such as passwords, OTPs, bank details, or personal data."
    },
    {
      "attackId": "AT002",
      "attackName": "Online Fraud and Scams",
      "description": "Online fraud and scams include deceptive activities carried out over the internet to steal money or information. These may involve fake job offers, lottery winnings, investment schemes, or impersonation of companies or individuals."
    },
    {
      "attackId": "AT003",
      "attackName": "Identity Theft",
      "description": "Identity theft occurs when someone illegally obtains and uses another person’s personal information, such as Aadhaar number, PAN, passwords, or bank details, to commit fraud, open accounts, or perform unauthorized transactions."
    },
    {
      "attackId": "AT004",
      "attackName": "Social Media Account Hacking",
      "description": "This attack involves unauthorized access to social media accounts. Attackers may misuse the account to send scam messages, spread false information, impersonate the victim, or steal private data and images."
    },
    {
      "attackId": "AT005",
      "attackName": "Cyberstalking and Online Harassment",
      "description": "Cyberstalking and online harassment involve repeated and unwanted online behavior intended to threaten, intimidate, abuse, or emotionally harm an individual. This may include messages, comments, fake profiles, or tracking online activity."
    },
    {
      "attackId": "AT006",
      "attackName": "Fake Websites and Impersonation",
      "description": "Fake websites and impersonation attacks involve creating websites, emails, or online profiles that closely resemble legitimate organizations or individuals. These are used to mislead users into sharing sensitive information or making payments."
    },
    {
      "attackId": "AT007",
      "attackName": "Malware or Ransomware Attack",
      "description": "Malware attacks involve malicious software that infects devices to steal data, spy on users, or damage systems. Ransomware is a type of malware that locks files or systems and demands payment in exchange for restoring access."
    },
    {
      "attackId": "AT008",
      "attackName": "Online Financial Fraud",
      "description": "Online financial fraud includes unauthorized or deceptive financial transactions carried out using digital platforms. This may involve misuse of bank accounts, credit or debit cards, UPI, digital wallets, or fake payment requests."
    }
  ]


