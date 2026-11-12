const fs=require('node:fs');
const rows=[
[2025,'IK','6f4711e32c84829117e2.jpg',['Tabsen','Insani','Zeldris','Conjure','Invoke','Salty','Hardzera','Lucas','Jeff','PZ579','Neguin','Marvywn'],['BCN | Strike Cup','BCN | Yalla Compass 2025','BCN | League 2025','XMS | Master League','LCS | LCS League S1','LCS | LCS League S2','BCN | Finals 2025']],
[2024,'Miracle','7efb20f87d91cfd77311.jpeg',['Leonardo “4i20”','Ryan “NIKO”','Victor “T10”','Gabriel “DOLLYN”','Victor “VNCX”','Ysn “Tamashi”','Wen “Wentyl”','Bob “Bonjour”'],['GZ BGE','GZ PSL','BSTV Insanity S1','WHL World Ranking']],
[2023,'Chaos Sports Club','ad01ce3028b8f3b83dae.jpeg',['Eduardo “Oskar”','Yan “Scr1mx”','Marcos “Valknut”','Savio “FNX”','Rodrigo “Noway”','Bryan “KMX”','Allysson “ZDR”','Carlos “UCH”','Felipe “NooN”','Victor “Bronkz”','Caua “Cauajr”','Erick “DarK”','Bernardo “Bee”'],['GSC Pro Series','GSC Pro League','WHL ESL s2','RANK S Invitational','GZ Sanity Cup','RANK S DreamHack','ESC Libertadores','RANK S Major League']],
[2021,'Team Infinity','de3443dafa74cd6a62ab.jpeg',['Alysson “ShelzZ”','Lucas “Ryota”','Hernani “Kscerato”','Kauan “rN”','Kauã “Conjure”','Matheus “FugLY”','Renan “inovate”'],['GSE Masters','PNL Peninsula Cup','LCB Pro League','LCB Masters','SUVOH Major']],
[2020,'Penta E-sports','391183fa30133e4669af.jpeg',['Alysson “ShelzZ”','Lucas “Ryota”','Hernani “Kscerato”','Kauan “Kauan”','Ryan “Zenn”','Kauan “rN”','Cauê “AdreN”','Kauã “Conjure”','Matheus “FugLY”'],['TSL Nodus','TSL Renovated Game League','MAWARE Season','GSE Pro League','ACE Cup','LCB Pro League','GSE Tour','TSL Mjonir Cup']],
[2019,'TSY','b5cfd9c2ba3653ff9b37.jpeg',["Kauan “RN”","Diogo “Amz”","Fabrício “Whezz”","Lucas “Ryota”","Xacau","Draken","Felipe “FeeH”","Cauê “AdreN”","Fabrício “Fabri”","ScreaM","Jhow","Sick"],['TSL | APS League 2019','TSL | Forcefield 2019','GSE | TUES Season One 2019','GSE | TOC 2019','GSE | Major Extreme Masters 2019','GSE | Tour II 2019','GSE | Pro League 2019','GSE | HPL Season 3','GSE | Hardness Pro League Season 2']],
[2018,'RAZER','6212ffadbb36ec4e9596.jpeg',['Victor “StronG”','Leonardo “4i20”','Alysson “Pasha”','Alysson “ShelzZ”','João “4kkp”','Gabriel “Casta”','Matheus “Theuzz”','Erick “Kns”','João “PoweR”','Fabrício “Fabri”'],['TSL Major Premiere 1','TSL Major Cup 2018','TSL Hardnes League','TSL Brasil extreme Masters']]
];
const champions=rows.map(([year,name,file,roster,titles])=>({year,name,roster,titles,sourceImage:'assets/archive/'+file,logoCrop:year===2025?{x:.026,y:.012,w:.105,h:.066}:year===2024?{x:.033,y:.017,w:.095,h:.095}:{x:.035,y:.019,w:.09,h:.091}}));
champions.find(t=>t.year===2019).note='A mesma equipe competiu como Temp Stormy e Goblins Cheating em 2019, com mudança de tag.';
const rankings=JSON.parse(fs.readFileSync('research/team-top5.json','utf8'));
champions.forEach(t=>t.countries=t.roster.map((_,i)=>t.year===2025?(i===4?'LT':i===5?'DE':'BR'):t.year===2024?(['BR','BR','BR','BR','ES','FR','PL','FR'][i]):'BR'));
rankings.forEach(r=>r.teams.forEach(t=>t.countries=t.roster.map((_,i)=>r.year===2025?(i===7?'LT':'BR'):r.year===2024?(['BR','ES','PL','FR','BR','BR','BR','FR'][i]):'BR')));
const tsyCountries=["BR","BR","BR","BR","BR",null,"BR","BR","BR",null,null,"AR"];
champions.find(t=>t.year===2019).countries=tsyCountries;
rankings.find(t=>t.year===2019).teams.find(t=>t.rank===1).countries=tsyCountries;
fs.writeFileSync('dist/team-years-data.js','window.RANKS_TEAM_YEARS = '+JSON.stringify({champions,rankings},null,2)+';\n');
