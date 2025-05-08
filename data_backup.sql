--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.4 (Ubuntu 17.4-1.pgdg24.04+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: api_task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_task (id, title, completed) FROM stdin;
1	sarah	f
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	users	user
2	users	instructor
3	users	student
4	st_notifications	predefinednotification
5	st_notifications	note
6	admin	logentry
7	auth	permission
8	auth	group
9	contenttypes	contenttype
10	sessions	session
11	api	task
12	authtoken	token
13	authtoken	tokenproxy
14	users	track
15	exams	answer
16	exams	exam
17	exams	studentanswer
18	exams	question
19	exams	studentexam
20	exams	mcqquestion
21	exams	temporaryexaminstance
22	exams	studentexamanswer
23	exams	cheatinglog
24	exams	codingquestion
25	exams	testcase
26	exams	codingtestcase
27	labs	lab
28	users	branch
29	users	course
30	social_django	association
31	social_django	code
32	social_django	nonce
33	social_django	usersocialauth
34	social_django	partial
35	st_notifications	pushsubscription
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add user	1	add_user
2	Can change user	1	change_user
3	Can delete user	1	delete_user
4	Can view user	1	view_user
5	Can add Instructor	2	add_instructor
6	Can change Instructor	2	change_instructor
7	Can delete Instructor	2	delete_instructor
8	Can view Instructor	2	view_instructor
9	Can add Student	3	add_student
10	Can change Student	3	change_student
11	Can delete Student	3	delete_student
12	Can view Student	3	view_student
13	Can add predefined notification	4	add_predefinednotification
14	Can change predefined notification	4	change_predefinednotification
15	Can delete predefined notification	4	delete_predefinednotification
16	Can view predefined notification	4	view_predefinednotification
17	Can add note	5	add_note
18	Can change note	5	change_note
19	Can delete note	5	delete_note
20	Can view note	5	view_note
21	Can add log entry	6	add_logentry
22	Can change log entry	6	change_logentry
23	Can delete log entry	6	delete_logentry
24	Can view log entry	6	view_logentry
25	Can add permission	7	add_permission
26	Can change permission	7	change_permission
27	Can delete permission	7	delete_permission
28	Can view permission	7	view_permission
29	Can add group	8	add_group
30	Can change group	8	change_group
31	Can delete group	8	delete_group
32	Can view group	8	view_group
33	Can add content type	9	add_contenttype
34	Can change content type	9	change_contenttype
35	Can delete content type	9	delete_contenttype
36	Can view content type	9	view_contenttype
37	Can add session	10	add_session
38	Can change session	10	change_session
39	Can delete session	10	delete_session
40	Can view session	10	view_session
41	Can add task	11	add_task
42	Can change task	11	change_task
43	Can delete task	11	delete_task
44	Can view task	11	view_task
45	Can add Token	12	add_token
46	Can change Token	12	change_token
47	Can delete Token	12	delete_token
48	Can view Token	12	view_token
49	Can add Token	13	add_tokenproxy
50	Can change Token	13	change_tokenproxy
51	Can delete Token	13	delete_tokenproxy
52	Can view Token	13	view_tokenproxy
53	Can add Track	14	add_track
54	Can change Track	14	change_track
55	Can delete Track	14	delete_track
56	Can view Track	14	view_track
57	Can add answer	15	add_answer
58	Can change answer	15	change_answer
59	Can delete answer	15	delete_answer
60	Can view answer	15	view_answer
61	Can add exam	16	add_exam
62	Can change exam	16	change_exam
63	Can delete exam	16	delete_exam
64	Can view exam	16	view_exam
65	Can add student answer	17	add_studentanswer
66	Can change student answer	17	change_studentanswer
67	Can delete student answer	17	delete_studentanswer
68	Can view student answer	17	view_studentanswer
69	Can add question	18	add_question
70	Can change question	18	change_question
71	Can delete question	18	delete_question
72	Can view question	18	view_question
73	Can add student exam	19	add_studentexam
74	Can change student exam	19	change_studentexam
75	Can delete student exam	19	delete_studentexam
76	Can view student exam	19	view_studentexam
77	Can add mcq question	20	add_mcqquestion
78	Can change mcq question	20	change_mcqquestion
79	Can delete mcq question	20	delete_mcqquestion
80	Can view mcq question	20	view_mcqquestion
81	Can add temporary exam instance	21	add_temporaryexaminstance
82	Can change temporary exam instance	21	change_temporaryexaminstance
83	Can delete temporary exam instance	21	delete_temporaryexaminstance
84	Can view temporary exam instance	21	view_temporaryexaminstance
85	Can add student exam answer	22	add_studentexamanswer
86	Can change student exam answer	22	change_studentexamanswer
87	Can delete student exam answer	22	delete_studentexamanswer
88	Can view student exam answer	22	view_studentexamanswer
89	Can add cheating log	23	add_cheatinglog
90	Can change cheating log	23	change_cheatinglog
91	Can delete cheating log	23	delete_cheatinglog
92	Can view cheating log	23	view_cheatinglog
93	Can add coding question	24	add_codingquestion
94	Can change coding question	24	change_codingquestion
95	Can delete coding question	24	delete_codingquestion
96	Can view coding question	24	view_codingquestion
97	Can add test case	25	add_testcase
98	Can change test case	25	change_testcase
99	Can delete test case	25	delete_testcase
100	Can view test case	25	view_testcase
101	Can add coding test case	26	add_codingtestcase
102	Can change coding test case	26	change_codingtestcase
103	Can delete coding test case	26	delete_codingtestcase
104	Can view coding test case	26	view_codingtestcase
105	Can add lab	27	add_lab
106	Can change lab	27	change_lab
107	Can delete lab	27	delete_lab
108	Can view lab	27	view_lab
109	Can add Branch	28	add_branch
110	Can change Branch	28	change_branch
111	Can delete Branch	28	delete_branch
112	Can view Branch	28	view_branch
113	Can add Course	29	add_course
114	Can change Course	29	change_course
115	Can delete Course	29	delete_course
116	Can view Course	29	view_course
117	Can add association	30	add_association
118	Can change association	30	change_association
119	Can delete association	30	delete_association
120	Can view association	30	view_association
121	Can add code	31	add_code
122	Can change code	31	change_code
123	Can delete code	31	delete_code
124	Can view code	31	view_code
125	Can add nonce	32	add_nonce
126	Can change nonce	32	change_nonce
127	Can delete nonce	32	delete_nonce
128	Can view nonce	32	view_nonce
129	Can add user social auth	33	add_usersocialauth
130	Can change user social auth	33	change_usersocialauth
131	Can delete user social auth	33	delete_usersocialauth
132	Can view user social auth	33	view_usersocialauth
133	Can add partial	34	add_partial
134	Can change partial	34	change_partial
135	Can delete partial	34	delete_partial
136	Can view partial	34	view_partial
137	Can add push subscription	35	add_pushsubscription
138	Can change push subscription	35	change_pushsubscription
139	Can delete push subscription	35	delete_pushsubscription
140	Can view push subscription	35	view_pushsubscription
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: users_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_user (id, password, last_login, is_superuser, username, first_name, last_name, is_staff, is_active, date_joined, role, email, signup_token, profile_image, phone_number, address) FROM stdin;
90	pbkdf2_sha256$870000$JcEgkZB5ZZ4rU6NTEeFCMj$Ck5G8gTcDtobrroZkXYRq6CHT7Bfko2oBYaYFzh9qjw=	\N	f	soad2			f	t	2025-04-14 02:19:21.919532+00	instructor	soad2@gmail.com	\N		\N	\N
21	pbkdf2_sha256$870000$Q5ER7SvBUjEzsd57owEX29$tzDX7vgDWUTYLt1fAmZ9a66IrkhXmry3vV8u1Jrtjqc=	\N	f	Rahma			f	t	2025-03-26 22:39:36.009045+00	student	rahma@gmail.com	\N	\N	\N	\N
23	pbkdf2_sha256$870000$Vl93ydSYvzGkq2vbtoZn09$1rp8tEN/DX1CkpPFlltZlzp7YPKgN3NkhkAl/oREiyg=	\N	f	farhea			f	t	2025-03-27 18:15:01.035185+00	instructor	farhaelnady643@gmail.com	\N	profile_images/White_Modern_E-Commerce_poster.png	\N	\N
36	pbkdf2_sha256$870000$ISCPa7PRKO85i9MdbXqQ24$vgZHzC8GilxN6nXvKGN5PuBNRK97l51SwCGqvi4p91Y=	\N	f	fatmaaM			f	t	2025-04-03 02:11:25.283911+00	student	fatmaa@gmail.com	\N	\N	\N	\N
92	pbkdf2_sha256$870000$EY4mLRQ82DG6ZB2H0aDXPL$Uc7dq8C9VIdo1Dbr7Pv0MLtwLehLYUVPNB+O/HE8X0E=	\N	f	lol			f	t	2025-04-14 02:40:43.665659+00	instructor	lol@gmail.com	\N		\N	\N
9	pbkdf2_sha256$870000$fu9Pn5WEizRGDos4JPhyJA$Nz6U/fZ4h6fGn6ntnYHRATmNuSa3YlD3IqnNV3PzKZQ=	2025-05-03 09:20:07.070153+00	t	R			t	t	2025-03-26 15:21:12.269159+00	student	r@gmail.com	\N	\N	\N	\N
19	pbkdf2_sha256$870000$SMstWhM1rpi8U3hRL6zEO2$uAcPDQA2IEWTUs+YNfGBSI9nZ8fOakHF5NxXKQSO7xQ=	\N	f	student77			f	t	2025-03-26 19:36:24.93407+00	student	studenttt@exrmdhtample.com	\N	\N	\N	\N
20	pbkdf2_sha256$870000$hjGB9vs95FBuNxa9Yp36qD$rrPhLxEdvgHGVECWtAYfWOHz86s0jll2uj/k517i2U8=	\N	f	student666			f	t	2025-03-26 21:49:31.172197+00	student	student6@exrmdhtample.com	\N	\N	\N	\N
11	pbkdf2_sha256$870000$suc9BPARSgG55wOGnSSyND$1Ppd1FVPWGbgmrowQOGTkNtDUadgxtkmbHURFOY1bqs=	\N	f	farheea			f	t	2025-03-26 16:09:01.624415+00	instructor	farhaelnady6483@gmail.com	\N	\N	\N	\N
12	pbkdf2_sha256$870000$hZlHnqbYP89kvpiUGgjRTb$fTcSszD783iZBqjmIJLDsESVZJZX6sFnh2MVrcvgDkc=	\N	f	student123			f	t	2025-03-26 16:11:22.245293+00	student	student@example.com	\N	\N	\N	\N
15	pbkdf2_sha256$870000$P6F757OvICs8vzhXnm03js$EKSBWjUKD7GJyj2tQdN+hKMtFyVOotI/DWapIKWajsk=	\N	f	student1234			f	t	2025-03-26 18:34:34.301593+00	student	student1234@example.com	\N	\N	\N	\N
16	pbkdf2_sha256$870000$x20gLUJ7Ij0l9TpxZ4Z0EQ$MBHyfN4hHiQ67YNxM7zS4wo4ATtSNC8n/nYyDWJphmg=	\N	f	student1235678			f	t	2025-03-26 18:47:56.253324+00	student	student12345@example.com	\N	\N	\N	\N
17	pbkdf2_sha256$870000$2baMxx003wIAJ2WK5NzEFU$YcYkWUgySxgcp5hsIkxGD9MxWcSY/9KDp+Un8oGnwsA=	\N	f	student12553			f	t	2025-03-26 19:28:44.872508+00	student	student@exrmdhtample.com	\N	\N	\N	\N
18	pbkdf2_sha256$870000$37nwofDYAbXu5k4A2bSNMf$fIlUcsyi0gPjWK7ztIbvmwdegiPlHCCSPJLWIlywIP0=	\N	f	student125535555			f	t	2025-03-26 19:34:41.903517+00	student	studenttttt@exrmdhtample.com	\N	\N	\N	\N
25	pbkdf2_sha256$870000$svlimFP6WiaJmCMWpXRjFY$MjtMff4/6Km7ZfzGFg2DjgCi2RTh0cnp/YdrS7J7u8g=	2025-03-27 18:37:03.108777+00	t	mokhtar			t	t	2025-03-27 18:29:27.066638+00	student	farha@gmail.com	\N	\N	\N	\N
26	pbkdf2_sha256$870000$BnkPdcQ4ZgNHAQQsjVjMpt$B94Msnv5F9fFfH/u3Ol8iIrlCZzGy0BpsiI8/QRusjg=	\N	f	john_doe			f	t	2025-03-27 20:04:46.836337+00	instructor	john@example.com	\N	\N	\N	\N
27	pbkdf2_sha256$870000$vXWjufxd6W8F4iwmuNxDb2$VFW9nuuGcNPGENMmk9d99e4ZRfY/QKPnF+IcGQeOo8s=	\N	f	stunt123			f	t	2025-03-27 20:08:54.559422+00	student	stude@xample.com	\N	\N	\N	\N
28	pbkdf2_sha256$870000$MRBiVUXRDXkpjpprVha7Y7$oHoGaTFKCYvC4llzW6ViVuFMhl3QWWDoy8SGS3vZYDM=	\N	f	fofa_elnady			f	t	2025-03-27 20:12:45.033113+00	student	stude@x22ample.com	\N	\N	\N	\N
34	pbkdf2_sha256$870000$bHPb8csZBSMjIoD4U1edFS$QVb7FbA3zhof247rGoyHT+2zvUyUyaQSuil/0Ek5ASQ=	\N	f	new			f	t	2025-04-03 00:46:29.175727+00	student	new@newstudent.com	\N	\N	\N	\N
35	pbkdf2_sha256$870000$OWxTB6qCBHTRcFqKpza9nD$4eG9bkJVnEJ9sNIbZsBAcOBGXDSuzC7pLIb2fWYE42Q=	\N	f	newStudent			f	t	2025-04-03 01:09:27.924562+00	student	newStudent@newstudent.com	\N	\N	\N	\N
37	pbkdf2_sha256$870000$RXqMtP44FMjsmfjlf9p2pl$ZOE3ekNEmPI6WCiaE7rQnPzP7jihVolcd0O18Qdnmzc=	\N	f	bata			f	t	2025-04-03 02:53:18.180142+00	student	bata@bata.com	\N	\N	\N	\N
38	pbkdf2_sha256$870000$yzxdppEiBDo4PUAU9kjOzy$5j11v+MgTG8/NRl3iHpMaz7O+95Y7uZ/h0NCXa6xrtg=	\N	f	soso			f	t	2025-04-03 02:58:06.62038+00	student	soso@soso.com	\N	\N	\N	\N
39	pbkdf2_sha256$870000$NdjQb07hZ0onuXKxRr1SL5$MOPxFRVOGmQUeAjVeclqzwT6G8pqjqpfdCnjNR07zSc=	\N	f	batabata			f	t	2025-04-03 11:40:48.399248+00	student	batabata@gmail.com	\N	\N	\N	\N
40	pbkdf2_sha256$870000$90Ei7CcwGnfxFuWHTdzid8$j1erUiq+3jQPlJg4ZNOPNLHHRnaaGCdcEoSnVf8D3yE=	2025-04-06 02:29:08.354092+00	t	Sadmin			t	t	2025-04-06 02:28:22.147121+00	student	sa@gmail.com	\N	\N	\N	\N
51	pbkdf2_sha256$870000$0arXM1JtzjwxsYkNK9lF6W$QoEcgORE/CNli3WhvcpQ+hS6VYMqoYLB7R3u9Y+iGps=	\N	f	newStudentnew			f	t	2025-04-12 03:33:29.804041+00	student	newStudentnew@gmail.com	\N		\N	\N
52	pbkdf2_sha256$870000$m5oioeWHHw5dUtXtpu88it$hpCAjVeU/9nnyLSrS2mx1Tooulq/91iY3Jo+l5hnOzo=	\N	f	newStudentnewnew			f	t	2025-04-12 03:34:52.094576+00	student	newStudentnewnew@gmail.com	\N		\N	\N
54	pbkdf2_sha256$870000$TZTQtUcIA8iby2OXuDDqPf$LFBswtu2kOj1TCja2asE+r1BpZNj9p5RopqonbN1lCY=	\N	f	new_test_student_student			f	t	2025-04-12 03:48:04.228784+00	student	new_stu@example.com	\N		\N	\N
45	pbkdf2_sha256$870000$bUBEM73zjyUdhQI6ihIlVE$3fAZfg5CBGH+8fWpITmqjLOuXy6/qlkqgrE3ZvhxtF0=	\N	f	fff			f	t	2025-04-12 02:05:33.500964+00	instructor	fff@example.com	\N		\N	\N
46	pbkdf2_sha256$870000$3JC09h8zHK7VXbF7UA9Uz4$0u1sOh3XxHaFVOKJCrMdrwrFGZ0/cYD42owP4KaRV1c=	\N	f	fofaelnady			f	t	2025-04-12 02:13:37.582675+00	student	farhamokhtar683@gmail.com	\N		\N	\N
47	pbkdf2_sha256$870000$GSXCvU4KUP7SGQtM42sNJf$3JeZDceq7LAsgM2a69OAmS0CJWdObthLPTvWFta+F/o=	\N	f	plaaa			f	t	2025-04-12 02:18:28.583096+00	student	elnady0925@gmail.com	\N		\N	\N
48	pbkdf2_sha256$870000$4J0jAa3xgch1jr2sg0LXOo$ZrKgevGV1omNF4DhPnYqOMwsCvscgqt3CV7HaP73cqk=	\N	f	FarhaElnady			f	t	2025-04-12 02:24:02.31719+00	student	farhaelnady3@gmail.com	\N		\N	\N
53	pbkdf2_sha256$870000$hFIvgRtjYwen8pNlvSxbkM$nC07Cx6xh8AAKJGDWAl1HXIiRs0wYkF9avjw0eR1nEs=	\N	f	test_student			f	t	2025-04-12 03:47:43.218241+00	student	test@example.com	\N		\N	\N
49	pbkdf2_sha256$870000$8nLldGrCVWUNztyB2787uC$P0bZE0K29mnl1mijTejfP3E/fOzIOXj2Ky+S7Q2IC6o=	\N	f	ff			f	t	2025-04-12 02:32:33.180876+00	instructor	ff@example.com	\N		\N	\N
50	pbkdf2_sha256$870000$hy3c7tWaJSaLxWuYUrS4Cp$MvxSr8CKUQDGHPJoRTWQEZZ7gV4sgYEUANOjib0F63k=	\N	f	farhaaa			f	t	2025-04-12 02:34:35.408978+00	student	sarr98@gmail.com	\N		\N	\N
55	pbkdf2_sha256$870000$MpSMAcra4pKIs8tnJ1ssDX$NxhUlYgDUDwXcu5OhY6CLa2b4gIAjRIGI6V+AWPB8cE=	\N	f	faaaaaaaaaaatmaaaaaaaaaaa			f	t	2025-04-12 03:54:53.520012+00	student	faaaaaaaaaaatmaaaaaaaaaaa@example.com	\N		\N	\N
56	pbkdf2_sha256$870000$wvHlH6qPLH9EJWGSx2vHga$sORb+UBn37oi7g9Vv1KNePWkj4DCJS2/eCgAEH4Z6bs=	\N	f	fw			f	t	2025-04-12 04:04:03.657704+00	student	fw@gmail.com	\N		\N	\N
57	pbkdf2_sha256$870000$YXbkVjU5UJGLKyFzly9XbK$NeyhaYyi842Hciv8LIyZ19Zr7SaAK8umVocZ0EmIACE=	\N	f	ffww			f	t	2025-04-12 04:05:29.885357+00	student	ffww@gmail.com	\N		\N	\N
58	pbkdf2_sha256$870000$VEu0KCOq4Bv5Gv7RM47HwQ$GWnwwRQH/3Qc0oJbPRzXnAtZJktGWEv7V6/BIAh4gzg=	\N	f	test1			f	t	2025-04-12 04:36:24.389587+00	student	test1@example.com	\N		\N	\N
44	pbkdf2_sha256$870000$XJ0l3zAZjQ1BpzC4gNYdPW$HU/Y0eLHN+4w24Xzk6u5aoTxSz15YL91urnLwDPhj8s=	\N	f	Farha_Elnady			f	t	2025-04-09 20:41:53.841702+00	student	farhaelnady683@gmail.com	\N	profile_images/Untitled-removebg-preview.png	\N	\N
59	pbkdf2_sha256$870000$MQrugFerJ5EcLxwUtCjoMB$2BkFCWZ/9OLpKjvcfPxzUvQfdho4hA3t50lphuCaqWU=	\N	f	test3			f	t	2025-04-12 04:40:33.016069+00	student	test3@example.com	\N		\N	\N
60	pbkdf2_sha256$870000$m9LLexmlG5jZwmveQrKpnF$hK88Y8BLBAa03evOI3IEHGv79Xyspj1UCPmSSdWEnU4=	\N	f	test4			f	t	2025-04-12 04:43:12.499219+00	student	test4@example.com	\N		\N	\N
61	pbkdf2_sha256$870000$RHlVRWlvm2nkeS84s3r9vE$yKpqnNnWn2FklTCNw+hT80FVp1UHMCqKbFX0bjyt5mw=	\N	f	test5			f	t	2025-04-12 04:43:15.088149+00	student	test5@example.com	\N		\N	\N
94	pbkdf2_sha256$870000$BhxXlUMN9TYinP4UOjScyM$8i7W/3ogW5WIiUFSeC86iPvUYCtneFXyR0dZLCeVQAs=	\N	f	sarahreg			f	t	2025-04-15 01:14:46.863636+00	instructor	sarahreg@gmail.com	\N		\N	\N
64	pbkdf2_sha256$870000$PJDa3BX5UDsFfu6bUHxY7f$pMBvD6FFJjj79IloQ/I27jjDFHq+TH6n01UwJ2Ndq5M=	\N	f	test6			f	t	2025-04-12 04:46:46.023938+00	student	test6@example.com	\N		\N	\N
65	pbkdf2_sha256$870000$7x1I4drzOXTdCh4Kj2GTGU$ns2+/Sju1sfVV7z4dcC0/k2ShoU1Yo8fUHCCDeBpVlk=	\N	f	fatmamahmoud			f	t	2025-04-12 05:00:11.434915+00	student	fatmamahmoud@gmail.com	\N		\N	\N
66	pbkdf2_sha256$870000$3FqWOc9ie62x62ptnU28wy$jek7q9reWtm1w6xQeSFppP7ZAbkgsNbLd+GS1BF5CaQ=	\N	f	test7			f	t	2025-04-12 05:00:37.39945+00	student	test7@example.com	\N		\N	\N
67	pbkdf2_sha256$870000$D1QlVQs5woXa1UUo26agdN$ePJSoW9tYiXiP/GHhV8a6MgkiPSZX7hllurBk1bMb0I=	\N	f	test8			f	t	2025-04-12 05:00:39.593256+00	student	test8@example.com	\N		\N	\N
102	pbkdf2_sha256$870000$G6qf2AmH54DgOfu9EihFhI$6QQCgRVWBXv2a7Pk2flWm6j/98FpSi+2Zze/AXPl458=	\N	f	FarhaPla			f	t	2025-04-15 21:59:43.851871+00	student	f@gmail.com	\N		\N	\N
95	pbkdf2_sha256$870000$5IYL6dbIzFKqChOwqOgqzT$Qt7APjCIB1QLE7DhfQ2PL8V5DFI26U+HwqCugfCDUyY=	\N	f	sarahrrrrr			f	t	2025-04-15 03:39:29.637436+00	instructor	sarahreg9999@gmail.com	\N		\N	\N
96	pbkdf2_sha256$870000$5gxwoZCob71I41COIoiHXc$O1jbl1WmGTOH3CjXbbES03mIdiCM5hRamEOpKg6cHoI=	\N	f	iti			f	t	2025-04-15 03:41:50.676563+00	instructor	sarahreg9998@gmail.com	\N		\N	\N
91	pbkdf2_sha256$870000$0fPFl5bIC07tILzE69lQhP$EFD7WzbHfU8LFr0gs9TGb5O4gJTwZVC7BJ6+hp4gGS4=	\N	f	t			f	t	2025-04-14 02:25:01.359754+00	instructor	t@gmail.com	\N		\N	\N
73	pbkdf2_sha256$870000$f8grE1ZAsNcEn8xKdM0n3j$3KS+RlDQpUVwy2UbM4qSp3QTuwIde/tYMT2AtgP/lvE=	\N	f	fatmaaa			f	t	2025-04-13 00:35:11.800377+00	instructor	fatmaaa@gmail.com	\N	profile_images/fatma.jpg		
74	pbkdf2_sha256$870000$PDFE1jgZGEUMZn2jsTS6pv$MT7liNraAaP8AU8qeK9PdRBTJkYQesKX5i9smYTaEyE=	\N	f	stu_one			f	t	2025-04-13 01:14:10.649726+00	student	stu_one@gmail.com	\N		\N	\N
97	pbkdf2_sha256$870000$yYYUMt31Lcz2L43Xfsspkk$E79fSl5Q6DG31cO+SkPp2btZh2c1rj/lT9fTb/sA7LU=	\N	f	Library			f	t	2025-04-15 04:03:12.638645+00	instructor	sarahreg998@gmail.com	\N		\N	\N
68	pbkdf2_sha256$870000$s9azKovYDuRXRxYAQdLFPe$4fFd2qxyfXkdgdUt8MqU7/EogAAQBHhUDsOlSttAEAY=	\N	f	soad			f	t	2025-04-12 15:27:34.599621+00	instructor	soad@gmail.com	\N	\N	\N	\N
69	pbkdf2_sha256$870000$M1NmjhfqQfze27rrDQhjul$Wk9DMxfQxC3fPhI0ZsFhFQ3fHCKOceBqXFeq0iTLIBA=	\N	f	mohamed			f	t	2025-04-12 15:57:18.355714+00	instructor	mohamed@gmail.com	\N	\N	\N	\N
70	pbkdf2_sha256$870000$ynjKFhAwURzRPkrZYgitNa$FGRbCsmr2/lffNc4tWO/7wGZrAio9a1flTF/WAQa4ow=	\N	f	HHHHhh			f	t	2025-04-12 18:20:48.081094+00	instructor	h@gmail.com	\N	\N	\N	\N
75	pbkdf2_sha256$870000$4fCnO8y138nhyHT29xDojF$SLvi+ZTInUe5wrWQKjzNYOEQHyL2hFlOwqurVGRyYNA=	\N	f	test333			f	t	2025-04-13 01:15:17.795756+00	student	test333@example.com	\N		\N	\N
76	pbkdf2_sha256$870000$tJgYoQGQfzWmYnI1WOT2xs$hIc0CLKS/c5Q9IJPLbCyQ7uGsXuWwRGbg2zChvGa5Sw=	\N	f	Farha__Elnady			f	t	2025-04-13 19:04:45.267731+00	student	farhaelnady@gmail.com	\N		\N	\N
93	pbkdf2_sha256$870000$D0ks54ha4Z7wZ28PfIQ08m$GW8FUVi06I1t/qt4M+iQHrRPSJoUetV/5pOtmmzYC5E=	\N	f	Rahma3			f	t	2025-04-14 12:37:39.879277+00	instructor	Rahma3@gmail.com	\N		\N	\N
98	pbkdf2_sha256$870000$cAOmFJ5KsBBaaqVoHGQ3LL$B+keMbJ6nw6LLu4D9HCyDuZ4zoE86sIlf5sBCved0bs=	\N	f	mmm			f	t	2025-04-15 04:11:46.846915+00	instructor	mmm@gmail.com	\N		\N	\N
72	pbkdf2_sha256$870000$KQWcuoRcutz5kVh9ZWCtQH$kqLXMD3ZvJ3feWmFYHysD42q3G+MomCajsJ2+YG9d4I=	\N	f	test9			f	t	2025-04-12 23:27:08.586716+00	student	test9@example.com	\N		\N	\N
99	pbkdf2_sha256$870000$amQh654mqcelmykFw7nRMW$KYxtMr19mNxwC98zL7Ae8sxbfoB9O16zUJMMhufEPvc=	\N	f	mmmsss			f	t	2025-04-15 04:18:21.44534+00	instructor	mmmsss@gmail.com	\N		\N	\N
100	pbkdf2_sha256$870000$hASJi79Rti2sVMWQMstvEw$EixJCqtZxWFJSDL/Ob8w1f10sPMe4d/EZEpS24Ll6+w=	\N	f	new15			f	t	2025-04-15 04:21:06.527601+00	instructor	new15@gmail.com	\N		\N	\N
105	pbkdf2_sha256$870000$K1d0FvJK78lOfeDdFER5mY$yZz/hoAqfXWdOVyngAhpO/LucSCdDwitLNk+1XU0OiI=	\N	f	Faaaa			f	t	2025-04-15 22:04:13.699551+00	student	faaaa@gmail.com	\N		\N	\N
83	pbkdf2_sha256$870000$67EadqPaqzee1v5DwV24CS$TnMqmpolpudrLD8C1zVXqJ80Vx8GJzIom9UIc4FthLQ=	\N	f	FarhElnady			f	t	2025-04-13 22:33:18.859036+00	student	farh@gmail.com	\N		\N	\N
84	pbkdf2_sha256$870000$PrjNtumVm3SSoqVaUaSZOL$Dd3iAiOYCXOlHtpwoLMlRpbBj0gLtZjxOgA3h89G7IQ=	\N	f	Farhlnady			f	t	2025-04-13 22:39:14.911279+00	student	farhaaaa@gmail.com	\N		\N	\N
85	pbkdf2_sha256$870000$KmVYxUiD8sspQfw6NSMuFi$KrNcmN7pXK0zW7JO5/LHEwZtDT6376CYBJy4S+/sHKE=	\N	f	f			f	t	2025-04-13 22:44:10.851698+00	student	rmdh@gmail.com	\N		\N	\N
106	pbkdf2_sha256$870000$DwvvIwUAsirdRZo6rNgfOs$vkqlT3P2ToJiyfGydgiAD+7pRWa4iJRn5673+++gu/M=	\N	f	FaaaarhaElnady			f	t	2025-04-15 22:14:44.375186+00	student	faaaarhaElnadyyy@gmail.com	\N		\N	\N
87	pbkdf2_sha256$870000$hCd6RdGBCFRmCqZAMX8h1b$fQH8Wh/5Xar+D9tDF4+bxDEh2+60ZFxBjeocuRAPEqg=	\N	f	Farh			f	t	2025-04-13 23:21:36.956908+00	student	farhaa@gmail.com	\N		\N	\N
88	pbkdf2_sha256$870000$Ex22BILSOgaBNQWuLVhl5y$7UI7kKUYhFq9Q+gK9yg1zftsmdHM6cxehzc6Sn8lEq8=	\N	f	FarhamokhtarE			f	t	2025-04-13 23:23:56.430104+00	student	farhaaplaaaaa@gmail.com	\N		\N	\N
101	pbkdf2_sha256$870000$RQ84AQ2XyHbJLi7n0NTNCu$QE6EFnLKxXjmmZD9gcPnxz6shVZMYZAs6tjuElhNby8=	\N	f	Farha			f	t	2025-04-15 21:26:54.817963+00	instructor	farha.instructor@example.com	\N	profile_images/WhatsApp_Image_2025-03-08_at_1.16.56_AM.jpeg		
14	pbkdf2_sha256$870000$KBiLQEqXuhXE6FUvGg9Pji$R9T5f8byV3L5/wbthx8t7lQ6MeuDsl6sskC1pOS9SsY=	\N	f	sarah			f	t	2025-03-26 18:28:58.120284+00	instructor	saraahamrr98@gmail.com	\N	profile_images/WhatsApp_Image_2025-04-14_at_3_eFktUB2.22.41_AM.jpeg	01069811224	El-sherouk
89	pbkdf2_sha256$870000$Yt15lzPxvEtK3QqXExuxAz$BpLkQfRUnZZ6x6sJPszjzuDAZVDfVCzVNOeEsn/3u7o=	\N	f	Farhamokh			f	t	2025-04-14 00:07:59.7549+00	student	faaa@gmail.com	\N		\N	\N
30	pbkdf2_sha256$870000$5Msbw2C7gTgFeZH9MnxiGP$EGiy4XQKxkOjgBiDN4qJ37ZgbcJgvRlQp0JZPTbL78U=	\N	f	Rahma Medhat2			f	t	2025-03-28 12:10:09.952705+00	student	rmdht857@gmail.com	\N	profile_images/2_23kQozS.jpeg	01127281299	El-Sherouk
107	pbkdf2_sha256$870000$tlDnbTi8VmlfmknKYhnaoo$lra8XahaB9VGGJ/CtjerSqwQsQqql1tUq1hztZVaYF8=	\N	f	H			f	t	2025-04-16 22:05:18.72192+00	instructor	HH@gmail.com	\N		\N	\N
108	pbkdf2_sha256$870000$xTl6FKyAMjXayw85cJfPlf$ViTxjH/eczitjuhbbMQPwXHZIGyjsD6PifUTJ1T/6go=	\N	f	Ahmed3			f	t	2025-04-17 00:50:36.977885+00	student	Ahmed3@gmail.com	\N		\N	\N
109	pbkdf2_sha256$870000$OLkYjWUAdt5TeAbrmUHXD8$iU0UxiKYT62XkYxT5tnMIx1uOuLLv/WG0Z0m0zJaV3g=	\N	f	RahmaA			f	t	2025-04-17 01:50:37.506164+00	instructor	RahmaA@gmail.com	\N		\N	\N
138	pbkdf2_sha256$870000$bN9PeziEUQVWptU9bgQfSD$sxw9PYFhcgvpUzs3zvJtfYpUriW8XEyuTC4QMZcG9+c=	\N	f	mohamedonga			f	t	2025-04-18 01:30:40.318542+00	student	mohamed.onga@university.edu	\N		\N	\N
86	pbkdf2_sha256$870000$AfOheCSNSkVzv1xH1T0fKC$PhbbmXH0BTV7wE0GCot8CNAovo/H+PbkfPl6eZfP/s0=	\N	f	Saraahamrru			f	t	2025-04-13 23:01:05.095011+00	student	sarahdiary4@gmail.com	\N	profile_images/WhatsApp_Image_2025-04-14_at_3.22.41_AM.jpeg	0 10 69811225	Elshrouklll
111	pbkdf2_sha256$870000$q2iSnROwiCVHU6a5SO1acH$jETgkHFSc7edHCvVzQj7Zia3IIcr34MAo4dnN4eBKiA=	\N	f	itiii			f	t	2025-04-17 23:46:17.358112+00	instructor	iti@gmail.com	\N		\N	\N
112	pbkdf2_sha256$870000$ICmDkhCRERW079LpOP3BgA$uazQ+2TIGRvCPg3kAuZEFdOTAmgeAowpv9D2B+18mdI=	\N	f	rahmaaaa			f	t	2025-04-17 23:52:57.834221+00	instructor	rr@gmail.com	\N		0111258966	street11
113	pbkdf2_sha256$870000$T6aZHI8UHMFiL0LhceqgUd$9MBtaPngI6LqS5hw/253Km9q8td8zyj8rlhTIJOtrqM=	\N	f	ffffffff			f	t	2025-04-18 01:18:07.529147+00	student	fffffffffffffff@gmail.com	\N		\N	\N
114	pbkdf2_sha256$870000$8Jlya36be8kUXJJCtNOb1h$vTLyTJHW4lP90rfa7ooOr1yrDUUv/A+kRuOT09nPR10=	\N	f	ddddd			f	t	2025-04-18 01:25:28.101371+00	student	ddddddd@gmail.com	\N		\N	\N
115	pbkdf2_sha256$870000$OhuRswxDTNsJ7OHObCEupr$dtpx/Yyo0OeuOdOWsXid8iPbMpnAjH0A5XJLBSZ9+Ns=	\N	f	jjjjj			f	t	2025-04-18 01:27:10.605099+00	student	jjjjjjjj@gmail.com	\N		\N	\N
116	pbkdf2_sha256$870000$SUmUDpLravtPcbriHIYZSi$2sl0eU4o+JbrZkNkwaDDBY0YrHZPX66ptrVjRZpvWRw=	\N	f	abdallahbahaa1			f	t	2025-04-18 01:29:31.51815+00	student	abdallah.bahaa@university.edu	\N		\N	\N
117	pbkdf2_sha256$870000$YLqkNVpIetj5fHXMjk8Nlm$m96jGMBn5gKxRAd6FJmH5X6x1zJ1yHgQzp2whx86U+k=	\N	f	khoulyy			f	t	2025-04-18 01:29:34.678451+00	student	abdelrahman.elkhouly@university.edu	\N		\N	\N
118	pbkdf2_sha256$870000$MIh2zxvoQtpkbNDG7FHxZJ$Xr6D1BgMsirgVwyEFdptwdsb8wQmfhfQoMLnkxtKS0I=	\N	f	badawy24			f	t	2025-04-18 01:29:37.898133+00	student	abdelrahman.badawy@university.edu	\N		\N	\N
119	pbkdf2_sha256$870000$AzN6stRLOzv5S8BtHRZIMo$Tm98zmcHgmtcgRVfOyXYPIoSkO/1zuRdF7332dGHONw=	\N	f	abdelrehem			f	t	2025-04-18 01:29:40.938424+00	student	abdelrehem.ahmed@university.edu	\N		\N	\N
120	pbkdf2_sha256$870000$QnxdUaNeqmlNiOaSldAUMa$RUFEPqMmS2LK2nxJw5MFtnamnDPc27ChIQUVCmmly5o=	\N	f	abdullaharfa			f	t	2025-04-18 01:29:43.858312+00	student	abdullah.arfa@university.edu	\N		\N	\N
121	pbkdf2_sha256$870000$vlbnr5oR4b6W8GNUteIZNX$UanIOGyPnfEooUgJKl9mvLBSpopUQx/2cs7mpwkLDw0=	\N	f	abdulrahmankhawaga			f	t	2025-04-18 01:29:47.118315+00	student	abdulrahman.khawaga@university.edu	\N		\N	\N
122	pbkdf2_sha256$870000$cYYWY2lZ5pkGPIDCpDsyPw$94wjW13Inb+I6Gi8F8h6f5UoMOwlOGorS2AnQ/x2nJE=	\N	f	adelsrour			f	t	2025-04-18 01:29:50.198268+00	student	adel.mohamed@university.edu	\N		\N	\N
123	pbkdf2_sha256$870000$IgBSqkLuZTeiCzXv030ZOk$GA2GI4StVvTB3AIrM4d1pCPdudZZ89Fz3TExnEzQZlo=	\N	f	ahmedkamel180998			f	t	2025-04-18 01:29:53.348323+00	student	ahmed.kamel@university.edu	\N		\N	\N
124	pbkdf2_sha256$870000$x0irdsegswupz1d1u2H5aw$N+FHoN4K/+IijVJv2jJ9ejdi7nfhEgQ92LbbqjEcCVs=	\N	f	ahmedhelmyyy			f	t	2025-04-18 01:29:56.438337+00	student	ahmed.helmy@university.edu	\N		\N	\N
125	pbkdf2_sha256$870000$stCl3jTAk1rW89URMEv2Yh$4mA7T/2gQ4GXfdQu5Q7KXdtFa5YaA1dFrNIq3qS8xgc=	\N	f	amiraeltaher			f	t	2025-04-18 01:30:00.058245+00	student	amira.eltaher@university.edu	\N		\N	\N
126	pbkdf2_sha256$870000$EdmIUOWFIenKkQOcRy2LDW$ceBWSDvaaQrD+wZTx8+Zr1T0v/cTI7/NKdjLfP8HU2E=	\N	f	andrewessam			f	t	2025-04-18 01:30:03.188359+00	student	andrew.rizk@university.edu	\N		\N	\N
127	pbkdf2_sha256$870000$eaF1abkSPO9rdoRmahDKvb$Zo8TUIiFfmxWLe5fOou5q3ffUmaX9ZQSRnjtqeaRVY4=	\N	f	eyadosama			f	t	2025-04-18 01:30:06.248412+00	student	eyad.ibrahim@university.edu	\N		\N	\N
128	pbkdf2_sha256$870000$6sMdj21xQdFVqlAF8054gn$GLSNJOlEdZEDnA/2qDld/RQeLU1E3VTIwVe5rsmmC0M=	\N	f	hassanfahmy			f	t	2025-04-18 01:30:09.428798+00	student	hassan.fahmy@university.edu	\N		\N	\N
129	pbkdf2_sha256$870000$gBm0Ie9W03Oprb2HrYCQsZ$c3na8zEpzwVuFSAYwPpAWLA+A2By9JLOiens9LTNX1k=	\N	f	hazemphoenix			f	t	2025-04-18 01:30:12.538468+00	student	hazem.mohamed@university.edu	\N		\N	\N
130	pbkdf2_sha256$870000$6g9k0WawTZp7vd8qUaMCxH$vFr8URs1uRocyiRjKUUjts9FG1Ikt7WuzEXBbemSgGM=	\N	f	kareemsaad			f	t	2025-04-18 01:30:15.688435+00	student	kareem.saad@university.edu	\N		\N	\N
131	pbkdf2_sha256$870000$rcfzndiXs05FLPtpOZQrCO$U48MBHaaZGa/sFnK3/LArHMs1e+sEjRJn/bQq4C/+BM=	\N	f	karim54			f	t	2025-04-18 01:30:18.858297+00	student	karim.zarzour@university.edu	\N		\N	\N
132	pbkdf2_sha256$870000$zGl7J4RcbNDPYiTqjKsEXU$r1iVwrfZus0PO9z8KG1pQw1+vN0VXGOGXclT7xxDoBc=	\N	f	mahmoudabdelhaleem			f	t	2025-04-18 01:30:21.758468+00	student	mahmoud.abdelhaleem@university.edu	\N		\N	\N
133	pbkdf2_sha256$870000$EOO3kbwxA7vnAOBxWswkT9$ljORv3BJdtPBP4jPKCnEsJ2KvBkfq7iIY07jrPiI7Kk=	\N	f	mahmoudshalabyy			f	t	2025-04-18 01:30:24.858432+00	student	mahmoud.shalaby@university.edu	\N		\N	\N
134	pbkdf2_sha256$870000$Qslzkg9pIkxNVPrjxUWq2a$d0Cmxm3ingN8Z7OHKmEWRU2WOMXeDfpwMERsMvPZrmM=	\N	f	mariamelsaeed			f	t	2025-04-18 01:30:27.858847+00	student	mariam.elsaeed@university.edu	\N		\N	\N
135	pbkdf2_sha256$870000$Dx4ASw91JxhWSuC2wt3rdg$O3ZCVuMXJ0l31ZIb57fsZfV/fyL6KDVM7gwdLNnyBWI=	\N	f	minamedhat			f	t	2025-04-18 01:30:30.898704+00	student	mina.luka@university.edu	\N		\N	\N
136	pbkdf2_sha256$870000$QyDvtZOhr1Db36JOeTMLv6$eFVn3LV/18eGH85hlkHlVsg6N9JUcf8DzfT5XNm76G8=	\N	f	mohamedamgad			f	t	2025-04-18 01:30:33.778557+00	student	mohamed.amgad@university.edu	\N		\N	\N
137	pbkdf2_sha256$870000$1fLKuOhcvE3ofOJPdqihFS$/8SWE4PVHc8Zm5hoh5s71EyxPsBmqIjYXv94R8HShm4=	\N	f	mohamedesmatt			f	t	2025-04-18 01:30:37.021422+00	student	mohamed.esmat@university.edu	\N		\N	\N
139	pbkdf2_sha256$870000$hVYeQZvegsdVtBnHu04UvT$ZNV3smEDVQlt8qxws7Dw/P4fGKxIMtCKsjCPoCzRjlo=	\N	f	mohamedmam20			f	t	2025-04-18 01:30:43.358538+00	student	mohamed.mamdouh@university.edu	\N		\N	\N
140	pbkdf2_sha256$870000$HHWaWWXrS4lMvUsYOiVtin$5bmnSi3V9IXMwlq6Soiz9brKnjK9qJLci8B3UWvZM+4=	\N	f	mohamedmamdouh202			f	t	2025-04-18 01:30:46.398804+00	student	mohamed.mamdouh2@university.edu	\N		\N	\N
141	pbkdf2_sha256$870000$mR7mk82NIlOokJaCHZYMcB$k0kuCyP0NZHRx4k13peHNw/qElvZLlOsRxE0M+YKOP0=	\N	f	mohamedmostafa			f	t	2025-04-18 01:30:49.428589+00	student	mohamed.mostafa@university.edu	\N		\N	\N
142	pbkdf2_sha256$870000$n9Byg6ufQfXyaNpXpO2CG9$RUgz/4FIpN5eCGaFiO7G9Fk9QZ1oAJDRxrS2QS83YwE=	\N	f	mohamednasr18			f	t	2025-04-18 01:30:52.438485+00	student	mohamed.nasr@university.edu	\N		\N	\N
143	pbkdf2_sha256$870000$pe4QK9W4eKcMJJGQVfcWAh$i/JO5cmcMRtytqv99hOxXxHXHThOtnrlPpodUbuECtI=	\N	f	mohamedramadan			f	t	2025-04-18 01:30:55.568562+00	student	mohamed.ramadan@university.edu	\N		\N	\N
144	pbkdf2_sha256$870000$s2qk8hNQUbM9Sukq1bUPFp$UEpIJzD/+ljWd1r7umJUDQWFH7LoqX64p1jyzPU6Dyk=	\N	f	mohammedtareq			f	t	2025-04-18 01:30:58.46868+00	student	mohammed.tareq@university.edu	\N		\N	\N
145	pbkdf2_sha256$870000$XtsFKJxHqBwbdrVQT3hCGs$nJ4YCHoh5e1rcmrWEu50i2xvn94D3+fwg7XwiXhILuk=	\N	f	mostafaomar			f	t	2025-04-18 01:31:01.638698+00	student	mostafa.omar@university.edu	\N		\N	\N
146	pbkdf2_sha256$870000$mPM1AcEagh34OCqpSzuZ9r$ExWP4iBAaXy8Bykdvny3ZusyOcuxrR1c6vm3XFuWExU=	\N	f	muhammadelzemety			f	t	2025-04-18 01:31:04.538822+00	student	muhammad.elzemety@university.edu	\N		\N	\N
147	pbkdf2_sha256$870000$9S0seP3CgH6kGh7S706mfp$7OuxPkrAn3EQHkJ9KIQ826zNBgFugFJYjOFZr8B4/9Q=	\N	f	narimanawny			f	t	2025-04-18 01:31:07.510866+00	student	nariman.awny@university.edu	\N		\N	\N
148	pbkdf2_sha256$870000$063FeGF1x598qvp77FZSYv$ifF0PQCda6mJZfl8BPzemH2lRcF6kT0I4MStQGs9HQo=	\N	f	osamadiab			f	t	2025-04-18 01:31:10.508722+00	student	osama.diab@university.edu	\N		\N	\N
149	pbkdf2_sha256$870000$Ret1mfkuSftorfNd5yHDwG$GZLv3AMV7lVGGl20pf+OjdrqAtUAZM5NZW4bGSES/Ss=	\N	f	ranaellese			f	t	2025-04-18 01:31:13.508618+00	student	rana.ellese@university.edu	\N		\N	\N
150	pbkdf2_sha256$870000$fXpFNxbMrQBzVhuGvrW0l5$amH6F6wABFJ/SEY2/pPxWdt0CVwAcd0s6yCAEZRxxmE=	\N	f	rehamhatem			f	t	2025-04-18 01:31:16.738847+00	student	reham.hatem@university.edu	\N		\N	\N
151	pbkdf2_sha256$870000$lPFWUzfDZ4pD2IOOg4G7hC$rgb7Y+G+ZT+rkYyCje74ZMugTMkviWrqvj4hyz+mFgI=	\N	f	saraashraf			f	t	2025-04-18 01:31:19.838712+00	student	sara.madbouly@university.edu	\N		\N	\N
152	pbkdf2_sha256$870000$pKIr4uBDhdhDWqTGbaVuJH$f1XBEq9uQjpBth/8kMoKFUk50IBay7ilO8yXYTmQrZQ=	\N	f	yaramohammed			f	t	2025-04-18 01:31:22.79869+00	student	yara.mohammed@university.edu	\N		\N	\N
153	pbkdf2_sha256$870000$1tr6EMqd3x0BqYsSQAIIsn$pHz2X+Z1Dy1XnT9pHg7JcyZWMmGL2XS/cJ7tkRPXDLI=	\N	f	yassminsayed			f	t	2025-04-18 01:31:25.618901+00	student	yassmin.sayed@university.edu	\N		\N	\N
154	pbkdf2_sha256$870000$EupMuh96GGeTGH6aLlhPAW$Kz0VUR3VYHYostkkrI4/e5g6JIW+1Ab3Y9V1L5Aeczc=	\N	f	yusuufashraaf			f	t	2025-04-18 01:31:28.498649+00	student	youssef.ashraf@university.edu	\N		\N	\N
155	pbkdf2_sha256$870000$4UnwnMWMgPQ2jrSH5JpIIE$ZWtxXzqseIxyiWFXZY/soIBwEsKyQ08J7pQ4p4afs1c=	\N	f	q			f	t	2025-04-20 17:38:20.221895+00	instructor	q@q.com	\N		\N	\N
156	pbkdf2_sha256$870000$jwhzmKE5E4kWkwjYzThpmE$Z510vRwfj1yWe9KTM6TebFWiL1umtvgUxHR7Fj1c2R8=	\N	f	defaultstudent			f	t	2025-04-20 21:07:26.060124+00	student	default@student.com	\N		\N	\N
165	pbkdf2_sha256$870000$J3V930URkETvWKcqFDZLsD$hZNChCRtTvrT4HGUlfmGNuX+EuDntSGpqdY3U1h2504=	\N	f	fatma			f	t	2025-04-28 15:21:38.369235+00	instructor	fatmaa1601@gmail.com	\N	profile_images/fatma_qPozk1P.jpg		
158	!P5eDMN4vSgRFf8DAKE0lvkX8nkbbRoBHIN1PbhFQ	\N	f	fatma.storage.apps			f	t	2025-04-21 00:53:00.711609+00	instructor	fatma.storage.apps@gmail.com	\N		\N	\N
164	pbkdf2_sha256$870000$8K79i1XmehjfSppCSBbC8i$An55Aa1L91DZEmb9IyISgfd0qdd/zonVziOw3WZxYyE=	\N	f	test55			f	t	2025-04-28 01:10:44.165271+00	student	test55@gmail.com	\N		\N	\N
166	pbkdf2_sha256$870000$uLs57QL3Vsk0fXz08ENWWO$nuSseW2h1qz2XaAF4KXd8bmyKrnCF2QphCRdvy2fspk=	\N	f	ft			f	t	2025-04-28 22:18:05.131793+00	student	ft@university.edu	\N		\N	\N
110	pbkdf2_sha256$870000$1hzhjBqnr5qhPTOmSA3bQy$/GTdRhO5Rv48R6R6oi1POFuY8BjRlFWjQrGJtKX4IBA=	\N	f	RahmaMedht			f	t	2025-04-17 01:54:03.346202+00	instructor	RahmaMedhat@gmail.com	\N	profile_images/81ea723f-1597-4803-808a-8472e6927f77.jpeg	01236666666	
33	pbkdf2_sha256$870000$XrrkkILH3hUgQFpN6lvnut$13aKDul6ydAe/Te3ArZDWCpg7TAf1sa6mTcTSc0C2U0=	\N	f	rahmaa			f	t	2025-03-29 11:17:31.389876+00	student	rahmamedhat503@gmail.com	\N	profile_images/1733351072845.jpeg	987365214	cairo
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
b66a5812e75850c6f896d7845cc0aa68f57623db	2025-03-26 19:15:28.566529+00	14
b3e86a3e54bfd97f77177df1a16b61d20a0eb19a	2025-03-26 20:47:22.593937+00	9
cac70d2d0e8a1c76cf147ff1acdb122d5f821f0d	2025-03-27 21:18:56.24675+00	26
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
5	2025-03-26 15:25:09.684622+00	7	fatmaa1601@gmail.com	3		1	9
6	2025-03-26 15:25:09.684765+00	3	rahmamedhat503@gmail.com	3		1	9
7	2025-03-26 15:25:09.684839+00	5	saraahamrr98@gmail.com	3		1	9
8	2025-03-26 18:28:38.622958+00	13	saraahamrr98@gmail.com	3		1	9
9	2025-03-27 18:38:18.712703+00	1	open_source - farhea	1	[{"added": {}}]	14	25
10	2025-03-27 18:38:56.168623+00	1	open_source - farhea	2	[]	14	25
11	2025-03-27 19:11:51.198904+00	2	python	1	[{"added": {}}]	14	25
12	2025-03-27 19:21:47.712189+00	3	open_sourceee	1	[{"added": {}}, {"added": {"name": "Student", "object": "Student: sarah - Track: open_sourceee"}}, {"added": {"name": "Student", "object": "Student: farhea - Track: open_sourceee"}}]	14	25
13	2025-03-27 19:44:24.705858+00	4	Full Stack Development	1	[{"added": {}}]	14	25
14	2025-03-27 19:59:32.217654+00	4	Full Stack Development	2	[]	14	25
15	2025-03-28 11:53:57.301961+00	12	Student: Nour - Track: No Track	3		3	9
16	2025-03-28 11:56:30.97278+00	22	rmdht857@gmail.com	3		1	9
17	2025-03-28 12:09:28.385986+00	29	rmdht857@gmail.com	3		1	9
18	2025-04-21 00:53:32.927212+00	157	fatma.storage.apps@gmail.com	3		1	9
19	2025-04-21 00:54:09.147706+00	71	fmh@gmail.com	3		1	9
20	2025-04-24 23:06:38.116308+00	9	Instructor: fatma	3		2	9
21	2025-04-24 23:07:12.955439+00	32	fatmaa1601@gmail.com	3		1	9
22	2025-04-24 23:12:13.258086+00	159	fatmaa1601@gmail.com	1	[{"added": {}}]	1	9
23	2025-04-24 23:13:30.798082+00	35	Instructor: FatmaWafy	1	[{"added": {}}]	2	9
24	2025-04-24 23:19:55.420706+00	35	Instructor: FatmaWafy	2	[{"changed": {"fields": ["Branch"]}}]	2	9
25	2025-04-24 23:27:06.962414+00	35	Instructor: FatmaWafy	3		2	9
26	2025-04-24 23:27:38.052351+00	159	fatmaa1601@gmail.com	3		1	9
27	2025-04-24 23:28:30.773391+00	160	fatmaa1601@gmail.com	1	[{"added": {}}]	1	9
28	2025-04-24 23:29:10.003565+00	36	Instructor: FatmaWafy	1	[{"added": {}}]	2	9
29	2025-04-24 23:37:25.625404+00	36	Instructor: FatmaWafy	3		2	9
30	2025-04-24 23:38:17.376334+00	160	fatmaa1601@gmail.com	3		1	9
31	2025-04-24 23:39:24.25699+00	161	fatmaa1601@gmail.com	1	[{"added": {}}]	1	9
32	2025-04-24 23:40:27.54718+00	37	Instructor: FatmaWafy	1	[{"added": {}}]	2	9
33	2025-04-25 00:04:08.064422+00	37	Instructor: FatmaWafy	3		2	9
34	2025-04-25 00:05:07.974609+00	161	fatmaa1601@gmail.com	3		1	9
35	2025-04-25 00:08:49.746468+00	162	fatmaa1601@gmail.com	1	[{"added": {}}]	1	9
36	2025-04-25 00:10:03.269307+00	38	Instructor: FatmaWafy	1	[{"added": {}}]	2	9
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2025-04-15 09:52:36.906744+00
5	api	0001_initial	2025-04-15 09:52:37.440958+00
6	contenttypes	0002_remove_content_type_name	2025-04-15 09:52:37.575255+00
7	auth	0001_initial	2025-04-15 09:52:37.707904+00
8	auth	0002_alter_permission_name_max_length	2025-04-15 09:52:37.842155+00
9	auth	0003_alter_user_email_max_length	2025-04-15 09:52:37.97593+00
10	auth	0004_alter_user_username_opts	2025-04-15 09:52:38.11122+00
11	auth	0005_alter_user_last_login_null	2025-04-15 09:52:38.245534+00
12	auth	0006_require_contenttypes_0002	2025-04-15 09:52:38.379658+00
13	auth	0007_alter_validators_add_error_messages	2025-04-15 09:52:38.514737+00
14	auth	0008_alter_user_username_max_length	2025-04-15 09:52:38.649222+00
15	auth	0009_alter_user_last_name_max_length	2025-04-15 09:52:38.783166+00
16	auth	0010_alter_group_name_max_length	2025-04-15 09:52:38.917723+00
17	auth	0011_update_proxy_permissions	2025-04-15 09:52:39.051838+00
18	auth	0012_alter_user_first_name_max_length	2025-04-15 09:52:39.186616+00
20	authtoken	0002_auto_20160226_1747	2025-04-15 09:52:39.455162+00
21	authtoken	0003_tokenproxy	2025-04-15 09:52:39.589145+00
22	authtoken	0004_alter_tokenproxy_options	2025-04-15 09:52:39.722004+00
23	exams	0001_initial	2025-04-15 09:52:39.855563+00
24	labs	0001_initial	2025-04-15 09:52:39.98952+00
25	sessions	0001_initial	2025-04-15 09:52:40.126735+00
26	st_notifications	0001_initial	2025-04-15 09:52:40.26542+00
27	exams	0002_temporaryexaminstance_instructor	2025-04-15 09:57:37.249412+00
28	exams	0003_remove_temporaryexaminstance_instructor_and_more	2025-04-16 23:42:31.008548+00
29	exams	0004_alter_codingquestion_language_and_more	2025-04-20 21:44:54.827612+00
30	default	0001_initial	2025-04-20 21:44:56.443616+00
31	social_auth	0001_initial	2025-04-20 21:44:56.526682+00
32	default	0002_add_related_name	2025-04-20 21:44:56.635255+00
33	social_auth	0002_add_related_name	2025-04-20 21:44:56.817635+00
34	default	0003_alter_email_max_length	2025-04-20 21:44:57.171749+00
35	social_auth	0003_alter_email_max_length	2025-04-20 21:44:57.25651+00
36	default	0004_auto_20160423_0400	2025-04-20 21:44:57.45067+00
37	social_auth	0004_auto_20160423_0400	2025-04-20 21:44:57.612575+00
38	social_auth	0005_auto_20160727_2333	2025-04-20 21:44:57.997804+00
39	social_django	0006_partial	2025-04-20 21:44:58.631665+00
40	social_django	0007_code_timestamp	2025-04-20 21:44:59.27268+00
41	social_django	0008_partial_timestamp	2025-04-20 21:45:00.021151+00
42	social_django	0009_auto_20191118_0520	2025-04-20 21:45:00.803211+00
43	social_django	0010_uid_db_index	2025-04-20 21:45:01.288353+00
44	social_django	0011_alter_id_fields	2025-04-20 21:45:03.404709+00
45	social_django	0012_usersocialauth_extra_data_new	2025-04-20 21:45:04.069697+00
46	social_django	0013_migrate_extra_data	2025-04-20 21:45:04.763376+00
47	social_django	0014_remove_usersocialauth_extra_data	2025-04-20 21:45:05.267499+00
48	social_django	0015_rename_extra_data_new_usersocialauth_extra_data	2025-04-20 21:45:05.733127+00
49	social_django	0016_alter_usersocialauth_extra_data	2025-04-20 21:45:05.921021+00
50	social_django	0005_auto_20160727_2333	2025-04-20 21:45:06.315175+00
51	social_django	0001_initial	2025-04-20 21:45:06.419267+00
52	social_django	0002_add_related_name	2025-04-20 21:45:06.546161+00
53	social_django	0003_alter_email_max_length	2025-04-20 21:45:06.628884+00
54	social_django	0004_auto_20160423_0400	2025-04-20 21:45:06.712528+00
55	authtoken	0001_initial	2025-04-22 16:23:07.310666+00
56	admin	0001_initial	2025-04-22 16:25:01.700403+00
57	admin	0002_logentry_remove_auto_add	2025-04-22 16:25:01.849269+00
58	admin	0003_logentry_add_action_flag_choices	2025-04-22 16:25:01.929342+00
59	exams	0002_temporaryexaminstance_instructor_id_and_more	2025-04-22 16:25:59.822124+00
60	labs	0002_lab_submission_link	2025-04-22 16:26:09.76198+00
61	exams	0003_alter_codingquestion_language_and_more	2025-05-01 21:20:53.390581+00
62	st_notifications	0002_pushsubscription	2025-05-01 21:20:54.998948+00
63	st_notifications	0003_alter_pushsubscription_subscription	2025-05-02 01:23:24.873454+00
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
3hkbtlh6n559w93owniwjv61wwj4e9l0	.eJxVjMsOwiAQRf-FtSE8Bgou3fsNZDoDUjU0Ke3K-O_apAvd3nPOfYmE21rT1vOSJhZnYcTpdxuRHrntgO_YbrOkua3LNMpdkQft8jpzfl4O9--gYq_fOvjCpMGh9RCVdaqAYcwqB7SWIVIEUI4oeE8-G7C6OO1YDzhEpwHF-wPOMzcR:1txHcn:Tf4yV7JmDIRubu1AzQuGc854IVu_XGZtpVaU016CmI0	2025-04-09 03:40:17.449775+00
v2nkwn4n5sdjko1m2cjh0svkdm7np2rp	.eJxVjEEOwiAQRe_C2pDCWBhcuu8ZyMAMUjVtUtqV8e7apAvd_vfef6lI21rj1mSJI6uLCur0uyXKD5l2wHeabrPO87QuY9K7og_a9DCzPK-H-3dQqdVvDR32jiwHS8IuFSQ0Lpw7B8nkImByBigucEKPiNazTVC8EWOlhwLq_QHh0De2:1txSZs:NVQBTb-t-byYUal1PEHJhiZUKcaICGBJ6nHxk3dQ-EA	2025-04-09 15:22:00.534651+00
4lzkzble0hxaynytxd18m013ehscplf0	.eJxVjEEOwiAQRe_C2pDCWBhcuu8ZyMAMUjVtUtqV8e7apAvd_vfef6lI21rj1mSJI6uLCur0uyXKD5l2wHeabrPO87QuY9K7og_a9DCzPK-H-3dQqdVvDR32jiwHS8IuFSQ0Lpw7B8nkImByBigucEKPiNazTVC8EWOlhwLq_QHh0De2:1txVU4:k41PLDIsXwtxRv-oAQb41Wb96xC9Q6CJbx2Wydrtba0	2025-04-09 18:28:12.225374+00
7ux8gq50p192tvk7klf5zt1ro6cmsn9i	.eJxVjEEOwiAQRe_C2hBEmIJL9z0DmWFGqRpISrsy3l2bdKHb_977L5VwXUpau8xpYnVW1qvD70iYH1I3wnest6Zzq8s8kd4UvdOux8byvOzu30HBXr61w4E9D4DojBAcXXBkEE9ibDCA0WWJlCEIW-9N8HAVcIGYfObIYtT7AxH8OJY:1txs6B:fP3joEYJhBB5iBr_YLk0KIWE9v-WBU3Ecu6Fi40uK5M	2025-04-10 18:37:03.416431+00
wwzzxrk9r99aa1a006b75ot88cd6dauy	.eJxVjEEOwiAQRe_C2pDCWBhcuu8ZyMAMUjVtUtqV8e7apAvd_vfef6lI21rj1mSJI6uLCur0uyXKD5l2wHeabrPO87QuY9K7og_a9DCzPK-H-3dQqdVvDR32jiwHS8IuFSQ0Lpw7B8nkImByBigucEKPiNazTVC8EWOlhwLq_QHh0De2:1tz0O9:CdaW25Iock3jTo_71CshJ9_ckJI6ds0uNJohQepvP5o	2025-04-13 21:40:17.968967+00
vwbvtpf9cc4nz55yvnv3if0i4f679ci8	.eJxVjMsOwiAUBf-FtSG8Hy7d-w3kwgWpGkhKuzL-u63pQrdnZs6LBFiXGtaR5zAhORPFyOl3jJAeue0E79BunabelnmKdFfoQQe9dszPy-H-HVQYdaud5cpYI1AXrzwTmJjgydiiNQjwHKUyAE5GFpNwUaqMWWxm-VLryfsD44c3eg:1u1Fky:UxPYGLfbFbIil_r-EBS15Pv9PuU0Dc-1nHhczwovvMk	2025-04-20 02:29:08.4851+00
g6kvdad4fxnao3807506eveoowjgw4c6	.eJxVjEEOwiAQRe_C2pDCWBhcuu8ZyMAMUjVtUtqV8e7apAvd_vfef6lI21rj1mSJI6uLCur0uyXKD5l2wHeabrPO87QuY9K7og_a9DCzPK-H-3dQqdVvDR32jiwHS8IuFSQ0Lpw7B8nkImByBigucEKPiNazTVC8EWOlhwLq_QHh0De2:1u6fOX:LJrO9CWHypXVEfahDVGjgbNmeifQWDgp-cySQk2nQQI	2025-05-05 00:52:21.20708+00
pylyv1j6miazar19domogcbsv0fdvtce	.eJxVjEEOwiAQRe_C2pDCWBhcuu8ZyMAMUjVtUtqV8e7apAvd_vfef6lI21rj1mSJI6uLCur0uyXKD5l2wHeabrPO87QuY9K7og_a9DCzPK-H-3dQqdVvDR32jiwHS8IuFSQ0Lpw7B8nkImByBigucEKPiNazTVC8EWOlhwLq_QHh0De2:1uB92V:HL-vfYxg09sWGtIDjAQogYYuJlvbN3RfWb3InUjDUgg	2025-05-17 09:20:07.186155+00
\.


--
-- Data for Name: exams_cheatinglog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams_cheatinglog (id, exam_id, reason, "timestamp", user_id) FROM stdin;
3478	33	Student tried to switch tabs	2025-04-15 12:30:00+00	49
3518	102	Face not detected for extended period	2025-04-15 23:51:05.948+00	33
3544	107	User attempted to copy content	2025-04-16 23:13:25.879+00	30
3584	118	No face detected for extended period	2025-04-18 00:11:17.072+00	30
3624	125	No face detected for extended period	2025-04-18 02:54:21.558+00	30
3664	144	User switched to a new tab or minimized the browser	2025-04-27 00:31:58.463+00	30
3704	173	No face detected for extended period - automatic removal	2025-05-02 12:59:33.603+00	33
3479	99	User attempted to copy content	2025-04-15 19:40:35.533+00	33
3519	102	Face not detected for extended period	2025-04-15 23:51:06.493+00	33
3545	107	Copy attempt detected	2025-04-16 23:13:25.88+00	30
3585	118	No face detected for extended period	2025-04-18 00:11:17.571+00	30
3625	125	No face detected for extended period	2025-04-18 02:54:22.059+00	30
3665	157	No face detected for extended period - automatic removal	2025-04-29 01:59:58.149+00	33
3705	173	User switched to a new tab or minimized the browser	2025-05-02 12:59:34.204+00	33
3475	33	Student tried to switch tabs	2025-04-15 12:30:00+00	49
3476	33	Student tried to switch tabs	2025-04-15 12:30:00+00	49
3480	99	User attempted to copy content	2025-04-15 19:40:35.446+00	33
3520	102	Face not detected for extended period	2025-04-15 23:51:06.495+00	33
3546	107	User switched to a new tab or minimized the browser	2025-04-16 23:13:35.299+00	30
3586	118	No face detected for extended period	2025-04-18 00:11:17.572+00	30
3626	125	No face detected for extended period	2025-04-18 02:54:22.058+00	30
3666	157	No face detected for extended period - automatic removal	2025-04-29 01:59:58.154+00	33
3706	174	User switched to a new tab or minimized the browser	2025-05-02 13:02:25.795+00	33
3477	33	Student tried to switch tabs	2025-04-15 12:30:00+00	49
3481	99	No face detected for extended period	2025-04-15 19:40:54.17+00	33
3521	106	No face detected for 3 consecutive checks	2025-04-16 22:47:07.184+00	30
3547	107	Tab switching detected	2025-04-16 23:13:35.3+00	30
3587	119	No face detected for 3 consecutive checks	2025-04-18 00:20:08.272+00	30
3627	125	No face detected for extended period	2025-04-18 02:54:22.554+00	30
3667	157	No face detected for extended period - automatic removal	2025-04-29 01:59:59.153+00	33
3707	174	No face detected for extended period - automatic removal	2025-05-02 13:02:28.142+00	33
3482	99	No face detected for extended period	2025-04-15 19:40:53.599+00	33
3522	106	Face not detected for extended period	2025-04-16 22:47:08.692+00	30
3548	107	No face detected for 3 consecutive checks	2025-04-16 23:13:42.484+00	30
3588	119	No face detected for 3 consecutive checks	2025-04-18 00:20:08.277+00	30
3628	125	No face detected for extended period	2025-04-18 02:54:22.555+00	30
3668	157	No face detected	2025-04-29 01:59:59.147+00	33
3708	174	No face detected for extended period - automatic removal	2025-05-02 13:02:28.14+00	33
3483	99	No face detected for extended period	2025-04-15 19:40:53.499+00	33
3523	106	Face not detected for extended period	2025-04-16 22:47:08.691+00	30
3549	107	No face detected for 3 consecutive checks	2025-04-16 23:13:42.485+00	30
3589	119	Copy attempt detected	2025-04-18 00:20:15.65+00	30
3629	125	No face detected for extended period	2025-04-18 02:54:23.052+00	30
3669	157	No face detected for extended period - automatic removal	2025-04-29 01:59:59.155+00	33
3709	176	User attempted to copy content	2025-05-02 23:08:00.428+00	30
3484	99	No face detected for extended period	2025-04-15 19:40:54.175+00	33
3524	106	Face not detected for extended period	2025-04-16 22:47:09.196+00	30
3550	107	Face not detected for extended period	2025-04-16 23:13:44.021+00	30
3590	119	User attempted to copy content	2025-04-18 00:20:15.649+00	30
3630	125	No face detected for extended period	2025-04-18 02:54:23.054+00	30
3670	157	No face detected	2025-04-29 01:59:59.151+00	33
3710	175	No face detected for extended period - automatic removal	2025-05-02 23:10:29.399+00	30
3485	99	No face detected for extended period	2025-04-15 19:40:54.5+00	33
3525	106	Face not detected for extended period	2025-04-16 22:47:09.195+00	30
3551	107	Face not detected for extended period	2025-04-16 23:13:44.022+00	30
3591	119	Tab switching detected	2025-04-18 00:20:27.854+00	30
3631	125	No face detected for extended period	2025-04-18 02:54:23.549+00	30
3671	157	No face detected for extended period - automatic removal	2025-04-29 02:00:00.143+00	33
3711	175	No face detected for extended period - automatic removal	2025-05-02 23:10:30.396+00	30
3486	99	No face detected for extended period	2025-04-15 19:40:54.496+00	33
3526	106	Face not detected for extended period	2025-04-16 22:47:09.705+00	30
3552	107	Face not detected for extended period	2025-04-16 23:13:44.514+00	30
3592	119	User switched to a new tab or minimized the browser	2025-04-18 00:20:27.852+00	30
3632	125	No face detected for extended period	2025-04-18 02:54:23.55+00	30
3672	157	No face detected for extended period - automatic removal	2025-04-29 02:00:00.145+00	33
3712	175	No face detected	2025-05-02 23:10:30.394+00	30
3487	99	No face detected for extended period	2025-04-15 19:40:54.9+00	33
3527	106	Face not detected for extended period	2025-04-16 22:47:10.224+00	30
3553	107	Face not detected for extended period	2025-04-16 23:13:44.512+00	30
3593	119	Copy attempt detected	2025-04-18 00:20:55.168+00	30
3633	125	No face detected for extended period	2025-04-18 02:54:24.056+00	30
3673	158	No face detected for extended period - automatic removal	2025-04-29 02:18:33.33+00	33
3713	175	No face detected for extended period - automatic removal	2025-05-02 23:10:31.407+00	30
3488	99	No face detected for extended period	2025-04-15 19:40:55.407+00	33
3528	106	Face not detected for extended period	2025-04-16 22:47:09.706+00	30
3554	107	Face not detected for extended period	2025-04-16 23:13:45.001+00	30
3594	119	User attempted to copy content	2025-04-18 00:20:55.167+00	30
3634	125	No face detected for extended period	2025-04-18 02:54:24.057+00	30
3674	158	No face detected for extended period - automatic removal	2025-04-29 02:18:33.342+00	33
3714	178	No face detected for extended period - automatic removal	2025-05-03 09:55:09.958+00	30
3489	99	No face detected for extended period	2025-04-15 19:40:56.386+00	33
3529	106	Face not detected for extended period	2025-04-16 22:47:10.225+00	30
3555	107	Face not detected for extended period	2025-04-16 23:13:45.002+00	30
3595	119	No face detected for 3 consecutive checks	2025-04-18 00:21:06.27+00	30
3635	125	No face detected for extended period	2025-04-18 02:54:24.555+00	30
3675	158	No face detected	2025-04-29 02:18:34.087+00	33
3715	178	No face detected for extended period - automatic removal	2025-05-03 09:55:09.965+00	30
3490	99	No face detected for extended period	2025-04-15 19:40:55.402+00	33
3530	106	Face not detected for extended period	2025-04-16 22:47:10.701+00	30
3556	107	Face not detected for extended period	2025-04-16 23:13:45.506+00	30
3596	119	No face detected for 3 consecutive checks	2025-04-18 00:21:06.269+00	30
3636	125	No face detected for extended period	2025-04-18 02:54:24.556+00	30
3676	158	No face detected for extended period - automatic removal	2025-04-29 02:18:34.092+00	33
3716	178	No face detected	2025-05-03 09:55:10.903+00	30
3491	99	No face detected for extended period	2025-04-15 19:40:54.906+00	33
3531	106	Face not detected for extended period	2025-04-16 22:47:10.702+00	30
3557	107	Face not detected for extended period	2025-04-16 23:13:45.508+00	30
3597	119	Face not detected for extended period	2025-04-18 00:21:07.766+00	30
3637	125	No face detected for extended period	2025-04-18 02:54:25.051+00	30
3677	158	No face detected	2025-04-29 02:18:34.09+00	33
3717	178	No face detected	2025-05-03 09:55:10.906+00	30
3492	99	No face detected for extended period	2025-04-15 19:40:55.886+00	33
3532	106	Face not detected for extended period	2025-04-16 22:47:11.2+00	30
3558	107	Face not detected for extended period	2025-04-16 23:13:46.006+00	30
3598	119	Face not detected for extended period	2025-04-18 00:21:07.767+00	30
3638	125	No face detected for extended period	2025-04-18 02:54:25.052+00	30
3678	158	No face detected for extended period - automatic removal	2025-04-29 02:18:34.099+00	33
3718	178	No face detected for extended period - automatic removal	2025-05-03 09:55:10.907+00	30
3493	99	No face detected for extended period	2025-04-15 19:40:55.899+00	33
3533	106	Face not detected for extended period	2025-04-16 22:47:11.2+00	30
3559	107	Face not detected for extended period	2025-04-16 23:13:46.006+00	30
3599	119	Face not detected for extended period	2025-04-18 00:21:08.274+00	30
3639	125	No face detected for extended period	2025-04-18 02:54:25.548+00	30
3679	158	No face detected for extended period - automatic removal	2025-04-29 02:18:35.023+00	33
3719	178	No face detected for extended period - automatic removal	2025-05-03 09:55:11.918+00	30
3494	99	No face detected for extended period	2025-04-15 19:40:57.331+00	33
3534	106	Face not detected for extended period	2025-04-16 22:47:11.718+00	30
3560	107	Face not detected for extended period	2025-04-16 23:13:46.525+00	30
3600	119	Face not detected for extended period	2025-04-18 00:21:08.275+00	30
3640	125	No face detected for extended period	2025-04-18 02:54:25.549+00	30
3680	158	No face detected for extended period - automatic removal	2025-04-29 02:18:35.027+00	33
3720	178	No face detected for extended period - automatic removal	2025-05-03 09:55:10.909+00	30
3495	99	No face detected for extended period	2025-04-15 19:41:02.006+00	33
3535	106	Face not detected for extended period	2025-04-16 22:47:11.72+00	30
3561	107	Face not detected for extended period	2025-04-16 23:13:46.526+00	30
3601	119	Face not detected for extended period	2025-04-18 00:21:08.771+00	30
3641	125	No face detected for extended period	2025-04-18 02:54:26.047+00	30
3681	158	No face detected for extended period - automatic removal	2025-04-29 02:18:36.307+00	33
3721	178	No face detected for extended period - automatic removal	2025-05-03 09:55:11.92+00	30
3496	99	No face detected for extended period	2025-04-15 19:40:56.389+00	33
3536	106	Face not detected for extended period	2025-04-16 22:47:12.223+00	30
3562	107	Face not detected for extended period	2025-04-16 23:13:46.992+00	30
3602	119	Face not detected for extended period	2025-04-18 00:21:08.771+00	30
3642	125	No face detected for extended period	2025-04-18 02:54:26.048+00	30
3682	158	No face detected for extended period - automatic removal	2025-04-29 02:18:36.314+00	33
3722	178	No face detected for extended period - automatic removal	2025-05-03 09:55:12.884+00	30
3497	99	No face detected for extended period	2025-04-15 19:40:57.327+00	33
3537	106	Face not detected for extended period	2025-04-16 22:47:12.222+00	30
3563	107	Face not detected for extended period	2025-04-16 23:13:46.992+00	30
3603	119	Face not detected for extended period	2025-04-18 00:21:09.269+00	30
3643	125	No face detected for extended period	2025-04-18 02:54:26.6+00	30
3683	158	No face detected for extended period - automatic removal	2025-04-29 02:18:37.416+00	33
3723	178	No face detected for extended period - automatic removal	2025-05-03 09:55:12.886+00	30
3498	99	No face detected for extended period	2025-04-15 19:41:02.308+00	33
3538	106	Face not detected for extended period	2025-04-16 22:47:12.723+00	30
3564	108	User attempted to copy content	2025-04-16 23:34:26.797+00	30
3604	119	Face not detected for extended period	2025-04-18 00:21:09.27+00	30
3644	125	No face detected for extended period	2025-04-18 02:54:26.602+00	30
3684	158	No face detected for extended period - automatic removal	2025-04-29 02:18:37.417+00	33
3724	179	User switched to a new tab or minimized the browser	2025-05-03 10:03:35.458+00	30
3499	34	Student tried to switch tabs	2025-04-15 12:30:00+00	49
3539	106	Face not detected for extended period	2025-04-16 22:47:12.725+00	30
3565	108	User attempted to copy content	2025-04-16 23:34:26.802+00	30
3605	120	User attempted to copy content	2025-04-18 00:31:19.529+00	30
3645	125	No face detected for extended period	2025-04-18 02:54:27.048+00	30
3685	161	No face detected for extended period - automatic removal	2025-04-30 23:45:37.484+00	33
3725	180	User switched to a new tab or minimized the browser	2025-05-06 19:08:03.914+00	30
3500	104	User attempted to copy content	2025-04-15 23:09:25.031+00	33
3540	106	Face not detected for extended period	2025-04-16 22:47:13.211+00	30
3566	33	camera	\N	107
3606	121	No face detected for extended period	2025-04-18 00:32:51.461+00	30
3646	125	No face detected for extended period	2025-04-18 02:54:27.05+00	30
3686	165	No face detected for extended period - automatic removal	2025-05-02 03:09:34.388+00	33
3501	104	User attempted to copy content	2025-04-15 23:09:25.055+00	33
3541	106	Face not detected for extended period	2025-04-16 22:47:13.212+00	30
3567	109	User attempted to copy content	2025-04-16 23:59:45.193+00	30
3607	121	No face detected for extended period	2025-04-18 00:32:51.464+00	30
3647	125	No face detected for extended period	2025-04-18 02:54:27.552+00	30
3687	165	No face detected for extended period - automatic removal	2025-05-02 03:09:34.389+00	33
3502	34	Student tried to switch ay 7agaa for test	2025-04-15 12:30:00+00	49
3542	106	No face detected for 3 consecutive checks	2025-04-16 22:47:15.7+00	30
3568	109	User attempted to copy content	2025-04-16 23:59:45.199+00	30
3608	121	No face detected for extended period	2025-04-18 00:32:51.967+00	30
3648	125	No face detected for extended period	2025-04-18 02:54:27.552+00	30
3688	165	No face detected	2025-05-02 03:09:35.383+00	33
3503	37	Student tried to switch ay 7agaa for test	2025-04-15 12:30:00+00	49
3543	106	No face detected for 3 consecutive checks	2025-04-16 22:47:15.701+00	30
3569	117	User switched to a new tab or minimized the browser	2025-04-17 23:36:00.589+00	86
3609	121	No face detected for extended period	2025-04-18 00:32:51.968+00	30
3649	125	No face detected for extended period	2025-04-18 02:54:28.048+00	30
3689	165	No face detected for extended period - automatic removal	2025-05-02 03:09:35.384+00	33
3504	103	No face detected for extended period	2025-04-15 23:23:51.633+00	33
3570	117	User switched to a new tab or minimized the browser	2025-04-17 23:36:00.602+00	86
3610	121	User switched to a new tab or minimized the browser	2025-04-18 00:34:31.271+00	30
3650	125	No face detected for extended period	2025-04-18 02:54:28.049+00	30
3690	165	No face detected	2025-05-02 03:09:35.384+00	33
3505	103	No face detected for extended period	2025-04-15 23:23:51.652+00	33
3571	118	No face detected for extended period	2025-04-18 00:11:14.064+00	30
3611	122	User attempted to copy content	2025-04-18 00:38:31.914+00	86
3651	125	No face detected for extended period	2025-04-18 02:54:28.557+00	30
3691	165	No face detected for extended period - automatic removal	2025-05-02 03:09:35.385+00	33
3506	103	User attempted to copy content	2025-04-15 23:24:07.511+00	33
3572	118	No face detected for extended period	2025-04-18 00:11:14.067+00	30
3612	122	User attempted to copy content	2025-04-18 00:38:31.921+00	86
3652	125	No face detected for extended period	2025-04-18 02:54:28.557+00	30
3692	165	No face detected for extended period - automatic removal	2025-05-02 03:09:36.387+00	33
3507	102	No face detected for 3 consecutive checks	2025-04-15 23:50:42.001+00	33
3573	118	No face detected for extended period	2025-04-18 00:11:14.743+00	30
3613	123	User attempted to copy content	2025-04-18 02:15:31.947+00	86
3653	125	No face detected for extended period	2025-04-18 02:54:29.048+00	30
3693	165	No face detected for extended period - automatic removal	2025-05-02 03:09:36.388+00	33
3508	102	No face detected for 3 consecutive checks	2025-04-15 23:50:41.938+00	33
3574	118	No face detected for extended period	2025-04-18 00:11:14.743+00	30
3614	123	User attempted to copy content	2025-04-18 02:15:31.943+00	86
3654	125	No face detected for extended period	2025-04-18 02:54:29.049+00	30
3694	165	No face detected for extended period - automatic removal	2025-05-02 03:09:37.393+00	33
3509	102	No face detected for 3 consecutive checks	2025-04-15 23:50:50.415+00	33
3575	118	No face detected for extended period	2025-04-18 00:11:15.137+00	30
3615	123	User attempted to copy content	2025-04-18 02:15:32.68+00	86
3655	126	User switched to a new tab or minimized the browser	2025-04-18 15:56:14.644+00	33
3695	165	No face detected for extended period - automatic removal	2025-05-02 03:09:37.394+00	33
3510	102	No face detected for 3 consecutive checks	2025-04-15 23:50:50.404+00	33
3576	118	No face detected for extended period	2025-04-18 00:11:15.135+00	30
3616	123	User attempted to copy content	2025-04-18 02:15:32.674+00	86
3656	127	User attempted to copy content	2025-04-18 15:59:04.282+00	33
3696	166	User switched to a new tab or minimized the browser	2025-05-02 03:44:17.868+00	30
3511	102	No face detected for 3 consecutive checks	2025-04-15 23:51:03.496+00	33
3577	118	No face detected for extended period	2025-04-18 00:11:15.565+00	30
3617	123	User switched to a new tab or minimized the browser	2025-04-18 02:15:38.29+00	86
3657	129	User attempted to copy content	2025-04-19 23:35:51.534+00	30
3697	169	User attempted to copy content	2025-05-02 06:02:53.481+00	33
3512	102	No face detected for 3 consecutive checks	2025-04-15 23:51:03.445+00	33
3578	118	No face detected for extended period	2025-04-18 00:11:15.564+00	30
3618	123	User switched to a new tab or minimized the browser	2025-04-18 02:15:38.298+00	86
3658	131	No face detected for extended period - automatic removal	2025-04-21 00:10:20.011+00	30
3698	171	No face detected for extended period - automatic removal	2025-05-02 12:44:48.862+00	33
3513	102	Face not detected for extended period	2025-04-15 23:51:04.94+00	33
3579	118	No face detected for extended period	2025-04-18 00:11:16.072+00	30
3619	124	User attempted to copy content	2025-04-18 02:17:16.304+00	86
3659	131	No face detected for extended period - automatic removal	2025-04-21 00:10:20.013+00	30
3699	171	No face detected for extended period - automatic removal	2025-05-02 12:44:48.867+00	33
3514	102	Face not detected for extended period	2025-04-15 23:51:04.934+00	33
3580	118	No face detected for extended period	2025-04-18 00:11:16.07+00	30
3620	124	User attempted to copy content	2025-04-18 02:17:16.307+00	86
3660	131	No face detected	2025-04-21 00:10:21.013+00	30
3700	172	No face detected for extended period - automatic removal	2025-05-02 12:46:59.999+00	33
3515	102	Face not detected for extended period	2025-04-15 23:51:05.518+00	33
3581	118	No face detected for extended period	2025-04-18 00:11:16.558+00	30
3621	125	No face detected for extended period	2025-04-18 02:54:21.052+00	30
3661	131	No face detected	2025-04-21 00:10:21.012+00	30
3701	172	No face detected for extended period - automatic removal	2025-05-02 12:46:59.996+00	33
3516	102	Face not detected for extended period	2025-04-15 23:51:05.524+00	33
3582	118	No face detected for extended period	2025-04-18 00:11:16.557+00	30
3622	125	No face detected for extended period	2025-04-18 02:54:21.054+00	30
3662	131	No face detected for extended period - automatic removal	2025-04-21 00:10:21.016+00	30
3702	172	User attempted to copy content	2025-05-02 12:47:01.783+00	33
3583	118	No face detected for extended period	2025-04-18 00:11:17.07+00	30
3623	125	No face detected for extended period	2025-04-18 02:54:21.557+00	30
3663	131	No face detected for extended period - automatic removal	2025-04-21 00:10:21.014+00	30
3703	173	No face detected for extended period - automatic removal	2025-05-02 12:59:33.601+00	33
3447	85	No face detected for extended period	2025-04-14 23:16:40.438+00	33
3448	85	No face detected for extended period	2025-04-14 23:16:40.434+00	33
3449	85	No face detected for extended period	2025-04-14 23:16:40.927+00	33
3450	85	No face detected for extended period	2025-04-14 23:16:40.925+00	33
3451	85	No face detected for extended period	2025-04-14 23:16:41.408+00	33
3452	85	No face detected for extended period	2025-04-14 23:16:41.405+00	33
3453	85	No face detected for extended period	2025-04-14 23:16:41.923+00	33
3454	85	No face detected for extended period	2025-04-14 23:16:41.925+00	33
3455	85	No face detected for extended period	2025-04-14 23:16:48.989+00	33
3456	85	No face detected for extended period	2025-04-14 23:16:48.982+00	33
3457	85	No face detected for extended period	2025-04-14 23:16:49.415+00	33
3458	85	No face detected for extended period	2025-04-14 23:16:49.418+00	33
3459	86	No face detected for extended period	2025-04-14 23:37:26.961+00	33
3460	86	No face detected for extended period	2025-04-14 23:37:26.969+00	33
3461	87	No face detected for extended period	2025-04-15 00:24:27.026+00	33
3462	87	No face detected for extended period	2025-04-15 00:24:27.033+00	33
3463	87	No face detected for extended period	2025-04-15 00:24:27.546+00	33
3464	87	No face detected for extended period	2025-04-15 00:24:27.542+00	33
3465	88	User switched to a new tab or minimized the browser	2025-04-15 00:33:03.175+00	33
3466	88	User attempted to copy content	2025-04-15 00:33:29.569+00	33
3467	88	User attempted to copy content	2025-04-15 00:33:29.555+00	33
3468	89	User attempted to copy content	2025-04-15 00:48:26.624+00	33
3469	89	User attempted to copy content	2025-04-15 00:48:26.635+00	33
3470	33	Student tried to switch tabs	2025-04-15 13:45:00+00	49
3471	90	User attempted to copy content	2025-04-15 01:03:57.477+00	33
3472	90	User attempted to copy content	2025-04-15 01:03:57.485+00	33
3473	33	Student tried to switch tabs	2025-04-15 13:45:00+00	49
3474	33	Student tried to switch tabs	2025-04-15 12:30:00+00	49
3517	102	Face not detected for extended period	2025-04-15 23:51:05.946+00	33
\.


--
-- Data for Name: exams_codingquestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams_codingquestion (id, title, description, difficulty, starter_code, source, points, tags, created_at, updated_at, language) FROM stdin;
14	Factorial	Write a function that calculates the factorial of a number	Medium	def factorial(n):\n    # Your code here\n    return 1	deepseek	1	[]	2025-04-11 11:09:47.491985+00	2025-04-11 11:18:24.590131+00	Python
13	Reverse String	Write a function that reverses a string	Medium	def reverse_string(s):\n    # Your code here\n    return s	deepseek	1	[]	2025-04-11 11:08:22.368097+00	2025-04-11 11:18:53.789575+00	Python
12	Sum of Two Numbers	Write a function that returns the sum of two numbers	Hard	def sum_two_numbers(a, b):\n    # Your code here\n    return 0	deepseek	1	[]	2025-04-11 11:04:05.214896+00	2025-04-11 11:19:15.531687+00	Python
17	Find Maximum	Write a function that returns the maximum of two numbers	Easy	function findMax(a, b) {\n    // Your code here\n    return a;\n}	deepseek	1	[]	2025-04-11 16:10:45.687613+00	2025-04-11 20:56:44.659131+00	JavaScript
19	Array Sum	Write a function that sums all numbers in an array	Easy	function arraySum(arr) {\n    // Your code here\n    return 0;\n}	deepseek	1	[]	2025-04-11 16:14:33.943527+00	2025-04-11 20:57:41.929443+00	JavaScript
21	Array Product	Write a function that calculates the product of all numbers in an array	Medium	function calculateProduct(arr) {\\n    // Your code here\\n    return 1;\\n}	exam_ui	2	[]	2025-04-13 00:55:01.353284+00	2025-04-13 00:55:01.353476+00	JavaScript
26	Promise Retry	Implement a function that retries a failing promise up to N times before rejecting.	Medium	function retry(promiseFn, retries) {\\n  // Your code here\\n}	exam_ui	1	[]	2025-04-29 01:03:15.479665+00	2025-04-29 01:03:15.480848+00	javascript
25	Select Users	Select all users with age greater than a specific value	Easy	CREATE TABLE users (id INTEGER, age INTEGER);\nINSERT INTO users (id, age) VALUES (1, 25), (2, 30);	chatgpt	5	[]	2025-04-23 04:44:42.494956+00	2025-04-24 01:05:34.912308+00	sql
\.


--
-- Data for Name: exams_codingtestcase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams_codingtestcase (id, input_data, expected_output, question_id, function_name) FROM stdin;
13	0	1	14	factorial
12	5	120	14	factorial
11	'python'	nohtyp	13	reverse_string
10	'hello'	olleh	13	reverse_string
7	1, 2	3	12	sum_two_numbers
8	-5, 10	5	12	sum_two_numbers
21	[-1, 0, 1]	0	19	arraySum
20	[1, 2, 3, 4]	10	19	arraySum
23	-1, -5	-1	17	findMax
24	5, 10	10	17	findMax
26	[2, 4, 6]	12	21	calculateProduct
31	-- This is a comment about the query	1|25	25	
32	Failing API call, maxRetries=3	Retries 3 times then rejects	26	retry
\.


--
-- Data for Name: users_branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_branch (id, name) FROM stdin;
1	Smart Village
2	New Capital
3	Cairo University
4	Alexandria
5	Assiut
6	Aswan
7	Beni Suef
8	Fayoum
9	Ismailia
10	Mansoura
11	Menofia
12	Minya
13	Qena
14	Sohag
15	Tanta
16	Zagazig
17	New Valley
18	Damanhour
19	Al Arish
20	Banha
21	Port Said
22	Cairo Branch
\.


--
-- Data for Name: users_instructor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_instructor (id, experience_years, user_id, branch_id) FROM stdin;
6	\N	23	\N
7	\N	26	\N
10	\N	45	22
11	\N	49	6
12	\N	68	\N
13	\N	69	\N
14	\N	70	\N
16	\N	90	2
17	\N	91	15
18	\N	92	16
15	\N	73	\N
19	\N	93	19
20	\N	94	3
21	\N	95	16
22	\N	96	15
23	\N	97	12
24	\N	98	3
25	\N	99	3
26	\N	100	19
28	\N	107	17
29	\N	109	1
31	\N	111	14
32	\N	112	2
33	\N	155	2
34	\N	158	2
27	\N	101	1
30	\N	110	2
5	\N	14	2
40	\N	165	2
\.


--
-- Data for Name: users_track; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_track (id, name) FROM stdin;
1	open_source
4	Full Stack Development
3	open_sourceee
2	python
7	Full-Stack Python
8	Web Development
5	Python Track
\.


--
-- Data for Name: users_course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_course (id, name, instructor_id, track_id) FROM stdin;
27	Database	5	5
28	Freelance	5	5
29	html/css	5	5
30	cloud computing	5	5
31	JavaScript	5	5
32	React	5	5
33	Docker	5	5
34	Nodejs	5	5
35	PostgreSql	5	5
36	Django	5	5
37	Flask	5	5
38	Django	5	5
39	OS	5	5
40	Python	5	5
41	Bash	5	5
42	Git	5	5
\.


--
-- Data for Name: exams_exam; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams_exam (id, title, created_at, duration, course_id) FROM stdin;
65	General Exam	2025-05-02 02:48:06.714029+00	60	\N
66	Python Exam	2025-05-02 02:51:04.184085+00	60	40
47	Fundamentals of javascript	2025-04-26 23:36:23.65679+00	60	31
48	DemoTest	2025-04-29 01:03:18.067286+00	60	31
49	test points	2025-04-30 08:21:47.66569+00	60	\N
50	Django	2025-04-30 08:44:40.437991+00	60	36
\.


--
-- Data for Name: exams_exam_CodingQuestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."exams_exam_CodingQuestions" (id, exam_id, codingquestion_id) FROM stdin;
72	47	17
73	48	26
74	49	13
75	49	14
86	65	25
87	65	12
88	65	17
89	66	12
90	66	13
91	66	14
\.


--
-- Data for Name: exams_mcqquestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams_mcqquestion (id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, language, source, points) FROM stdin;
12	Which SQL statement is used to add a new column to a table?	ADD COLUMN	ALTER TABLE	MODIFY TABLE	INSERT COLUMN	B	Medium	sql	W3Schools	1.5
13	What is the purpose of the 'fetch()' API in JavaScript?	To make HTTP requests	To retrieve data from localStorage	To load external scripts	To query a database	A	Medium	javascript	MDN	1.5
14	What is the output of `print('Hello' * 3)` in Python?	HelloHelloHello	Hello3	TypeError	Hello Hello Hello	A	Easy	python	RealPython	1
15	What is the purpose of the 'useEffect' hook in React?	To manage component state	To perform side effects in function components	To handle events	To create reusable logic	B	Medium	javascript	React Docs	1.5
16	Which SQL statement is used to revoke privileges?	REMOVE	REVOKE	DENY	DELETE	B	Medium	sql	W3Schools	1.5
17	What is the output of `print(3 * '7')` in Python?	21	777	TypeError	'21'	B	Easy	python	exam_ui	1
\.


--
-- Data for Name: exams_exam_MCQQuestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."exams_exam_MCQQuestions" (id, exam_id, mcqquestion_id) FROM stdin;
57	47	12
58	47	13
59	47	14
60	48	12
61	48	13
62	48	14
63	48	15
64	48	17
65	49	12
66	49	13
67	50	12
68	50	13
93	65	12
94	65	13
95	65	14
96	66	17
97	66	14
\.


--
-- Data for Name: exams_temporaryexaminstance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams_temporaryexaminstance (id, start_datetime, end_datetime, exam_id, track_id, branch_id, instructor_id) FROM stdin;
144	2025-04-27 02:43:00+00	2025-04-27 03:43:00+00	47	\N	\N	30
145	2025-04-29 00:34:00+00	2025-04-29 01:34:00+00	47	\N	\N	30
146	2025-04-29 00:41:00+00	2025-04-29 01:41:00+00	47	\N	\N	30
147	2025-04-29 00:43:00+00	2025-04-29 01:43:00+00	47	\N	\N	30
148	2025-04-29 00:50:00+00	2025-04-29 01:50:00+00	47	\N	\N	30
149	2025-04-29 00:55:00+00	2025-04-29 01:55:00+00	47	\N	\N	30
150	2025-04-29 00:58:00+00	2025-04-29 01:58:00+00	47	\N	\N	5
151	2025-04-29 01:04:00+00	2025-04-29 02:04:00+00	47	\N	\N	27
152	2025-04-29 01:33:00+00	2025-04-29 02:33:00+00	47	\N	\N	30
153	2025-04-29 01:49:00+00	2025-04-29 02:49:00+00	47	\N	\N	30
154	2025-04-29 01:56:00+00	2025-04-29 02:56:00+00	47	\N	\N	30
155	2025-04-29 03:27:00+00	2025-04-29 04:27:00+00	47	5	\N	27
156	2025-04-29 03:57:00+00	2025-04-29 04:57:00+00	47	\N	\N	5
157	2025-04-29 04:31:00+00	2025-04-29 05:31:00+00	48	5	2	40
158	2025-04-29 05:12:00+00	2025-04-29 06:12:00+00	48	5	2	40
159	2025-04-29 05:23:00+00	2025-04-29 06:23:00+00	48	\N	\N	31
160	2025-04-29 05:33:00+00	2025-04-29 06:33:00+00	48	\N	\N	31
161	2025-05-01 02:31:00+00	2025-05-01 03:31:00+00	48	\N	\N	40
162	2025-05-01 02:45:00+00	2025-05-01 03:45:00+00	48	\N	\N	40
165	2025-05-02 05:52:00+00	2025-05-02 06:52:00+00	65	\N	\N	31
166	2025-05-02 06:40:00+00	2025-05-02 07:40:00+00	65	\N	\N	31
167	2025-05-02 06:54:00+00	2025-05-02 07:54:00+00	65	\N	\N	31
168	2025-05-02 08:18:00+00	2025-05-02 09:18:00+00	66	\N	\N	31
169	2025-05-02 08:49:00+00	2025-05-02 09:49:00+00	50	\N	\N	31
170	2025-05-02 14:05:00+00	2025-05-02 15:05:00+00	65	\N	\N	30
171	2025-05-02 15:42:00+00	2025-05-02 16:42:00+00	48	\N	\N	40
172	2025-05-02 15:46:00+00	2025-05-02 16:46:00+00	48	\N	\N	40
173	2025-05-02 15:59:00+00	2025-05-02 16:59:00+00	48	\N	\N	40
174	2025-05-02 16:01:00+00	2025-05-02 17:01:00+00	48	\N	\N	40
175	2025-05-03 02:04:00+00	2025-05-03 03:04:00+00	50	\N	\N	27
176	2025-05-03 02:06:00+00	2025-05-03 03:06:00+00	66	\N	\N	27
177	2025-05-03 02:14:00+00	2025-05-03 03:14:00+00	50	\N	\N	27
178	2025-05-03 12:53:00+00	2025-05-03 13:53:00+00	65	\N	\N	30
179	2025-05-03 12:58:00+00	2025-05-03 13:58:00+00	66	\N	\N	30
180	2025-05-06 22:04:00+00	2025-05-06 23:04:00+00	66	\N	\N	30
181	2025-05-06 22:11:00+00	2025-05-06 23:11:00+00	65	\N	\N	30
\.


--
-- Data for Name: exams_studentexamanswer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams_studentexamanswer (id, compressed_answers, score, submitted_at, student_id, exam_instance_id) FROM stdin;
70	\\x789c654e4d6b023110fd2b434e15d6ead68aa0a742afe2a1a7526559b3a306745693192a2cfef7ce74d1763573c89b97f791c61dfca928297d634c6e0a8dcb5ff4726f2e03978ffee0abc1777751eceb2ad0b66b9ad8f346c873a8093681aa79797e2a3358f7a05912e8190ce0b396086a47d861c4968ec81209e625ef9e0fbf9e756fb6a4cbb50a8b8849f66c455f8d3b0926eb284265955aac3256ae2b0b741436413fcfa03f36512d7ce36cc7f3113d63b5b8e343fa10ef3159124741fdc7bfbc7106f9b01bd7ee8f712dff10b7d2f901c5aa713d	2.5	2025-04-27 00:31:49.718693+00	18	144
71	\\x789c6d8e4f6b023110c5bfca9093e28a465d057b6a3d8b879e8a96256667356067357f5058fceece5444973639e4e5e5cdefa5513ff654180a67f441cda1517ac4877a5719283d16f9f12b272217eacadad6a5a35d7b6826cf55221b5d4d50392a97e6d231196cbbd06c08780d06f055270f3c8eb0478f77db634c9ec0f4b66f1bba3e0ab0f018d2210a7edda853c220e4c29552c4751c8becb5638e8e294aa0af33e8e712aa537c7853b9e3e5883662b97afa5a7c173e93b5188454994340fec80b30cf400fdb3c9dffcfbbe7fef2be79df00108b6e8d	0	2025-04-28 23:12:58.852203+00	19	145
72	\\x789c558f4f4fc3300cc5bf8a951388aaa22b0384c461084de202088e0c5551ea41a634ede20486aa7e77ecee9fa61cfcf2fcb35fd2abc6ac2bede91703a93be85531e1a21e5406aa2845ce467925f27194d3a37bb37507d6a6adadff3a5935b996f63279136deb21600c7f675d681b4b38f7d96858a473e81761e141ee2978381070b147a43fec63b00a48c94509f9e8d53a21c9fecad612c7a18c45f64e31ebbb1405986bebf8a5307b7d02a39dcba0d19bb76dce7d29c36d8a3bf699d3f215c14f719b17d3fc52bab8e9d044ac5f0ed46e184a88b6e11abf517ebb628c64c2d27b3206495eb2d48e70f8e4f30f8b9c77b1	3	2025-04-29 02:26:36.952875+00	19	159
73	\\x789cad50ef4b835014fd572e7e9986b27449501158bc6ab036a6ae183986e95d09f55cef070dd6fef7ded3ad5a18db87fce2f578ee39f79ca5f19abd4d53cadf9171e3049686eba997111836186ee77b3caac7959ab3322fe8d39f4bc77a9c499a89a2a4302b687e9b2eccd486470b960905f5b4db302e2503a584f08c0c6b98a1908c427afe789ad09516f37c2d76199220261007173d02922b53308b1cbafd985c93d086f409371f96daecf62312c61a197cb32b960577416f4422305d1b3cdfb2c1f46ce81ceaad843a0e8c07a3108623128ee1868404341c911eb98ce120a157e1e0b6564ce87df55f3b9f29814d2f3865c8e58bd0ad3c2c8d37895cb7302d729d43b5a4684261dbb482cea5a808ea2a4d29a55823fdf4150963253b01aa4668052d2838d052408eaa5bcc351f1773cc04e683afbd8e860b1ec92c43ae6d66e90b4775e50f37c7b7c13dfc1f3fbfd96f5239feaee178470d8eeac1f1b70f134c62b3b5e3ee91b5216ac56a96aca97bc6f1fc1d71faed00cc68d8b3b6fddd8f7ab3c17efde7e7013abff29fac3e0115901d47	7.5	2025-05-02 04:33:33.835489+00	18	167
74	\\x789c8d91516f82301485ff4ad33dc8324c284896f0b8ec7d0f7b5a1c2115ae42525b6c6fe78cf1bfaf65d101c3282f947b6ebf734e38d26db92bb8347bd08666e448d9c2bde82b0d0965cffef8424fee5caaaa919be166ece50ad6c4d86d817b5548bb5d3935e021593d669f92b8e7817c28ab89bb0fa4060dbf530d68b524fc69d519256792862f0780c2a0767681b98b629659366779475a9c496b5ea2d20d1781bc0b22cf35a1d060ac405f7279a43b0b061b258ba6f26867e0d6d0cd866b8d6c2dfa85c8ebca62ff13be5b2811aab7cb98f97163de6d5982f1883517065c821e291d92d22ba4389a66e51d6d1c3fb9117fd61eb0567236f496aac6433b1de04feb67406d4775663508a146602504d4d3dc8bf40f3bdd2cbed18c85241e9a27d3c6c9ed2ef334242cbaebffa4572ae4a71ffb5616cb	3	2025-05-02 05:23:42.488559+00	18	168
75	\\x789cab56ca4d2e8c4fcc2b2e4f2d2a56b252a856323402524a2e4a3a0a4a86c610662d909d9c9f9299978eac122a9a1a5f945a5c9a5302128b8ead0500d7c818f7	0	2025-05-02 23:15:44.680525+00	18	177
76	\\x789c8d90cb6ac33010457f65503729752172620a5977df4557a50d4696c78dc0969291440a26ffde51d240655c5269a1795c9db9d228067da895f547242f36300ab9e6433c8b02847cba84278eb56b8dfdcc95656ab7d8818f431d8eaeb67168b8bb500534f79b0f0bbceee0cd4502be8fb043c24b953044b2a01e9af3a0f595d4291d1c19d52f2c03e80f04651079358835a18f7d48f6de477188e88371b6366dc2f3109605aee53263f73124c132f55d0c3fa94c297eed51076c5ff2b2f1af516bf4091128221bf805aafe072a975354a77a8fa7ed9936755fde702f0b28f3b9abf9b9abdb0f78ac0a9093efa8e669d52c6dcbfb1be503b97f	1	2025-05-03 10:03:23.053295+00	18	179
77	\\x789c6d8ecd0ac23010845f658917c50a56298267ef1e3c894a68d3550336d164970ac57777e30f587073583233f9269d6acc4d972eb618a25a42a7f2852cb5528f0c94f1b575a7be3d4b768d4788dc686abd76dc54e20ecb0caad172ef4066005bcf01e43dc21903bed580c4c14139aebe74d401235f28b1779dba3146b2de695ba716e9921889d68f5977657a053278453cd34799a72bdeaf6808eb755fb671c3c6604c140a8cf2871fd6a4c8209ff669c57f5af1977690f3041a0368b0	1	2025-05-06 19:07:59.083313+00	18	180
\.


--
-- Data for Name: users_student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_student (id, university, graduation_year, college, leetcode_profile, github_profile, user_id, track_id, branch_id, inrollment_date) FROM stdin;
78	Minia University	2023	Faculty of Engineering	7zGga6DFj2	https://github.com/MrG-Andrew	126	5	2	2025-04-18
79	Port Said University	2025	Faculty of Science	Yt9EILhfBV	https://github.com/eyadbeh	127	5	2	2025-04-18
80	Damietta University	2024	Faculty of Computer Science	Hassan_Fahmy	https://github.com/fahmy8793	128	5	2	2025-04-18
81	Sohag University	2023	Faculty of Engineering	RiseFromTheAshes	https://github.com/HazemPhoenix	129	5	2	2025-04-18
82	South Valley University	2025	Faculty of Science	zGJkeYwRqc	https://github.com/KareemA-Saad	130	5	2	2025-04-18
83	Fayoum University	2024	Faculty of Engineering	karim54	https://github.com/K-nass	131	5	2	2025-04-18
84	Beni-Suef University	2023	Faculty of Computer Science	mahmoudabdelhaleem90	https://github.com/muhmouddd21	132	5	2	2025-04-18
85	Kafr El-Sheikh University	2025	Faculty of Engineering	mahmoudshalabyy4	https://github.com/MahmoudShalabyy	133	5	2	2025-04-18
86	Damanhour University	2024	Faculty of Science	mar_yumm1	https://github.com/maiamelsaeed	134	5	2	2025-04-18
87	Asyut University	2023	Faculty of Computer Science	mina3141	https://github.com/mina-medhat-00	135	5	2	2025-04-18
88	Menoufia University	2025	Faculty of Engineering	ZInJMFX5AI	https://github.com/MohamedAmgad2001	136	5	2	2025-04-18
89	Luxor University	2024	Faculty of Science	xa17x7O71h	https://github.com/mohamed-esmatt	137	5	2	2025-04-18
90	Banha University	2023	Faculty of Engineering	Mohamed_Onga	https://github.com/Onga24	138	5	2	2025-04-18
14	\N	\N	\N	\N	\N	23	3	\N	2024-11-11
91	Cairo University	2025	Faculty of Computer Science	MohamedMam20	https://github.com/MohamedMam20	139	5	2	2025-04-18
92	Ain Shams University	2024	Faculty of Engineering	MohamedMamdouh202	https://github.com/MohamedMamdouh55	140	5	2	2025-04-18
93	Alexandria University	2023	Faculty of Science	ZGc26gehVX	https://github.com/thepcvirus	141	5	2	2025-04-18
47	\N	\N	\N	\N	\N	66	8	1	2024-11-11
48	\N	\N	\N	\N	\N	67	8	1	2024-11-11
64	Ain Shams University	2024	Computer Science	ahmed	https://github.com/ahmed	108	8	2	2025-04-17
94	Helwan University	2025	Faculty of Engineering	MohamedNasr_18	https://github.com/Mohamed-Nasr18	142	5	2	2025-04-18
95	Mansoura University	2024	Faculty of Computer Science	M7MA652	https://github.com/m7ma652	143	5	2	2025-04-18
19	\N	2025	\N	Rahma503	https://github.com/Rahma503	33	5	2	2024-11-11
57	Cairo Universityyyy	2023	Urban and Regional Planninggg	Saraahamrr	https://github.com/Saraahamrr	86	8	2	2024-11-11
65	Ain Shams University	2022	Computer Science	ahmed	https://github.com/ahmed	113	8	2	2025-04-18
96	Assiut University	2023	Faculty of Science	MDwo9i3iPE	https://github.com/Mohammed-tareq	144	5	2	2025-04-18
66	Ain Shams University	2022	Computer Science	ahmed	https://github.com/ahmed	114	8	2	2025-04-18
67	Ain Shams University	2022	Computer Science	ahmed	https://github.com/ahmed	115	8	2	2025-04-18
68	Cairo University	2024	Faculty of Engineering	abdallahbahaa1	https://github.com/AbdallahBahaa	116	5	2	2025-04-18
53	Ain Shams University	2024	Computer Science	https://leetcode.com/farhaelnady	https://github.com/farhaelnady	76	8	\N	2024-11-11
69	Ain Shams University	2023	Faculty of Computer Science	khoulyy	https://github.com/khoulyy	117	5	2	2025-04-18
70	Alexandria University	2025	Faculty of Engineering	uJkR7KCeDJ	https://github.com/Badawy24	118	5	2	2025-04-18
71	Helwan University	2024	Faculty of Science	abdelrehem	https://github.com/Abdelrehem-A	119	5	2	2025-04-18
72	Mansoura University	2023	Faculty of Engineering	AbdullahArfa	https://github.com/Abdullah-Arfa	120	5	2	2025-04-18
73	Assiut University	2025	Faculty of Computer Science	kVGspZvvCR	https://github.com/AbdulRahmanKhawaga	121	5	2	2025-04-18
74	Banha University	2024	Faculty of Engineering	adelsrour	https://github.com/AdelSrour	122	5	2	2025-04-18
75	Tanta University	2023	Faculty of Science	ahmedkamel180998	https://github.com/ahmedkamel180998	123	5	2	2025-04-18
76	Zagazig University	2025	Faculty of Engineering	ahmedhelmyyy	https://github.com/ahmedddhelmyyy	124	5	2	2025-04-18
77	Suez Canal University	2024	Faculty of Computer Science	AmiraEltaher	https://github.com/AmiraEltaher	125	5	2	2025-04-18
97	Banha University	2025	Faculty of Engineering	MostafaOmar88	https://github.com/mostafaomar7	145	5	2	2025-04-18
98	Tanta University	2024	Faculty of Computer Science	Muhammad_Elzemety	https://github.com/MuhammadElzemety	146	5	2	2025-04-18
99	Zagazig University	2023	Faculty of Science	Nariman_Awny78	https://github.com/narimanawny78	147	5	2	2025-04-18
100	Suez Canal University	2025	Faculty of Engineering	oosa12377	https://github.com/oosa12377	148	5	2	2025-04-18
101	Minia University	2024	Faculty of Computer Science	ranaellese	https://github.com/ranaahmedd1	149	5	2	2025-04-18
102	Port Said University	2023	Faculty of Science	OOAfJOsNhv	https://github.com/RehamHatem	150	5	2	2025-04-18
103	Damietta University	2025	Faculty of Engineering	saraashraf	https://github.com/dashboard	151	5	2	2025-04-18
104	Sohag University	2024	Faculty of Computer Science	yara_mohammed	https://github.com/yara35	152	5	2	2025-04-18
105	South Valley University	2023	Faculty of Science	4EsjlfRPa9	https://github.com/YassminSayed2021	153	5	2	2025-04-18
106	Fayoum University	2025	Faculty of Engineering	yusuufashraaf	https://github.com/yusuufashraaf	154	5	2	2025-04-18
43	\N	\N	\N	\N	\N	60	8	\N	2024-11-11
45	\N	\N	\N	\N	\N	64	8	\N	2024-11-11
109	cairo	2020	Computer Science	fatmaa1601	https://github.com/fatmaa1601	164	5	2	2025-04-28
110	Cairo University	2024	Faculty of Engineering	ft	https://github.com/ft	166	5	2	2025-04-29
18	azharelshrif	2024	Urban and regional planning	Rahma503	https://github.com/Rahma503	30	5	2	2024-11-11
\.


--
-- Data for Name: exams_temporaryexaminstance_students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams_temporaryexaminstance_students (id, temporaryexaminstance_id, student_id) FROM stdin;
193	144	18
266	171	19
267	172	19
268	173	19
269	174	19
270	175	18
271	176	18
272	177	18
273	178	18
274	179	18
275	180	18
276	181	18
205	155	18
206	156	57
207	157	19
208	158	19
209	159	19
210	160	19
211	161	19
212	162	19
257	165	19
258	166	18
259	166	19
260	167	18
261	167	19
262	168	18
263	168	19
264	169	19
265	170	18
\.


--
-- Data for Name: labs_lab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.labs_lab (id, name, file, description, created_at, size, instructor_id, track_id, submission_link) FROM stdin;
39	FullStackWebDevUsing Python_Track Syllabus Overview.pdf	labs/Python Track/FullStackWebDevUsing_Python_Track_Syllabus_Overview.pdf	Lab material for Python Track	2025-04-24 00:53:14.921751+00	230.5 KB	110	5	https://drive.google.com/drive/folders/15uA6Zy6TJBh-mGONgWbssADpMvCUkbb5?usp=drive_link
42	Berlitz.pdf	labs/Python Track/Berlitz.pdf	Lab material for Python Track	2025-04-28 21:30:03.478674+00	320.0 KB	110	5	https://drive.google.com/drive/folders/15uA6Zy6TJBh-mGONgWbssADpMvCUkbb5?usp=drive_link
43	Python Lab 2.pdf	labs/Python Track/Python_Lab_2.pdf	Lab material for Python Track	2025-04-28 22:04:02.777918+00	41.0 KB	101	5	
44	Python Lab 2.pdf	labs/Python Track/Python_Lab_2_fIdZmVl.pdf	Lab material for Python Track	2025-04-29 00:24:35.394203+00	41.0 KB	101	5	
45	Lab1.pdf	labs/Python Track/Lab1.pdf	Lab material for Python Track	2025-05-02 04:51:37.373712+00	6.7 KB	111	5	https://drive.google.com/drive/folders/1QGbjIz4JNhx-SqXcDYoky9taJaGOgnJr?usp=sharing
46	django task-2.pdf	labs/Python Track/django_task-2_2tc02ji.pdf	Lab material for Python Track	2025-05-02 23:21:42.456881+00	70.2 KB	101	5	\N
47	قضية-1.pdf	labs/Python Track/قضية-1.pdf	Lab material for Python Track	2025-05-03 07:50:37.133579+00	24.3 KB	111	5	https://drive.google.com/drive/folders/1QGbjIz4JNhx-SqXcDYoky9taJaGOgnJr?usp=sharing
48	Recovery Key.pdf	labs/Python Track/Recovery_Key.pdf	Lab material for Python Track	2025-05-03 10:11:20.422491+00	176.8 KB	110	5	https://drive.google.com/drive/folders/15uA6Zy6TJBh-mGONgWbssADpMvCUkbb5?usp=drive_link
\.


--
-- Data for Name: social_auth_association; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_auth_association (id, server_url, handle, secret, issued, lifetime, assoc_type) FROM stdin;
\.


--
-- Data for Name: social_auth_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_auth_code (id, email, code, verified, "timestamp") FROM stdin;
\.


--
-- Data for Name: social_auth_nonce; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_auth_nonce (id, server_url, "timestamp", salt) FROM stdin;
\.


--
-- Data for Name: social_auth_partial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_auth_partial (id, token, next_step, backend, "timestamp", data) FROM stdin;
\.


--
-- Data for Name: social_auth_usersocialauth; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_auth_usersocialauth (id, provider, uid, user_id, created, modified, extra_data) FROM stdin;
\.


--
-- Data for Name: st_notifications_note; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.st_notifications_note (id, message, created_at, student_id, instructor_id, read, track_id) FROM stdin;
1289	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:05.56615+00	78	27	f	5
1290	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:05.779915+00	79	27	f	5
1291	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:05.881102+00	80	27	f	5
1292	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:05.991648+00	81	27	f	5
1293	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.094736+00	82	27	f	5
1294	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.197324+00	83	27	f	5
1295	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.301765+00	84	27	f	5
1296	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.410001+00	85	27	f	5
1297	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.534784+00	86	27	f	5
1298	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.65575+00	87	27	f	5
1299	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.758102+00	88	27	f	5
1300	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.860725+00	89	27	f	5
1301	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:06.974051+00	90	27	f	5
1302	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.09176+00	91	27	f	5
1303	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.194766+00	92	27	f	5
1304	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.294254+00	93	27	f	5
1305	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.400929+00	94	27	f	5
1306	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.545396+00	95	27	f	5
1309	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.855127+00	96	27	f	5
1310	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.955351+00	68	27	f	5
1311	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.058526+00	69	27	f	5
1312	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.171808+00	70	27	f	5
1313	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.280892+00	71	27	f	5
1314	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.384393+00	72	27	f	5
1315	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.488831+00	73	27	f	5
1316	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.612923+00	74	27	f	5
1317	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.716886+00	75	27	f	5
1318	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.82427+00	76	27	f	5
1319	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:08.938827+00	77	27	f	5
1320	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.049015+00	97	27	f	5
1321	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.153077+00	98	27	f	5
1322	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.264354+00	99	27	f	5
1323	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.381038+00	100	27	f	5
1324	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.500191+00	101	27	f	5
1325	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.615323+00	102	27	f	5
1326	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.734001+00	103	27	f	5
1327	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.843816+00	104	27	f	5
1328	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:09.944368+00	105	27	f	5
1329	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:10.041613+00	106	27	f	5
1330	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:10.152124+00	109	27	f	5
1332	new test	2025-04-28 22:30:19.692339+00	78	27	f	5
1333	new test	2025-04-28 22:30:19.928667+00	79	27	f	5
1334	new test	2025-04-28 22:30:20.053815+00	80	27	f	5
1335	new test	2025-04-28 22:30:20.164425+00	81	27	f	5
1336	new test	2025-04-28 22:30:20.288497+00	82	27	f	5
1337	new test	2025-04-28 22:30:20.422133+00	83	27	f	5
1338	new test	2025-04-28 22:30:20.535574+00	84	27	f	5
1339	new test	2025-04-28 22:30:20.650851+00	85	27	f	5
1340	new test	2025-04-28 22:30:20.762813+00	86	27	f	5
1341	new test	2025-04-28 22:30:20.871553+00	87	27	f	5
1342	new test	2025-04-28 22:30:20.997257+00	88	27	f	5
1343	new test	2025-04-28 22:30:21.111851+00	89	27	f	5
1344	new test	2025-04-28 22:30:21.219196+00	90	27	f	5
1345	new test	2025-04-28 22:30:21.327578+00	91	27	f	5
1346	new test	2025-04-28 22:30:21.43394+00	92	27	f	5
1347	new test	2025-04-28 22:30:21.554396+00	93	27	f	5
1348	new test	2025-04-28 22:30:21.666899+00	94	27	f	5
1349	new test	2025-04-28 22:30:21.779649+00	95	27	f	5
1352	new test	2025-04-28 22:30:22.127644+00	96	27	f	5
1353	new test	2025-04-28 22:30:22.246533+00	68	27	f	5
1354	new test	2025-04-28 22:30:22.353802+00	69	27	f	5
1355	new test	2025-04-28 22:30:22.466558+00	70	27	f	5
1356	new test	2025-04-28 22:30:22.5871+00	71	27	f	5
1287	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-28 21:46:43.30764+00	18	27	t	\N
1308	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.754882+00	18	27	t	5
1357	new test	2025-04-28 22:30:22.691716+00	72	27	f	5
1358	new test	2025-04-28 22:30:22.790235+00	73	27	f	5
1359	new test	2025-04-28 22:30:22.895494+00	74	27	f	5
1360	new test	2025-04-28 22:30:22.998814+00	75	27	f	5
1361	new test	2025-04-28 22:30:23.098299+00	76	27	f	5
1362	new test	2025-04-28 22:30:23.194012+00	77	27	f	5
1363	new test	2025-04-28 22:30:23.299671+00	97	27	f	5
1364	new test	2025-04-28 22:30:23.398375+00	98	27	f	5
1365	new test	2025-04-28 22:30:23.495027+00	99	27	f	5
1366	new test	2025-04-28 22:30:23.590524+00	100	27	f	5
1367	new test	2025-04-28 22:30:23.69641+00	101	27	f	5
1368	new test	2025-04-28 22:30:23.793283+00	102	27	f	5
1369	new test	2025-04-28 22:30:23.901163+00	103	27	f	5
1370	new test	2025-04-28 22:30:23.99866+00	104	27	f	5
1371	new test	2025-04-28 22:30:24.094103+00	105	27	f	5
1372	new test	2025-04-28 22:30:24.191663+00	106	27	f	5
1373	new test	2025-04-28 22:30:24.288528+00	109	27	f	5
1374	new test	2025-04-28 22:30:24.38661+00	110	27	f	5
1288	A new exam "Exam 47" has been scheduled for you at 4/29/2025, 4:04:00 AM.	2025-04-28 22:01:14.3328+00	19	27	t	\N
1307	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-28 22:04:07.657131+00	19	27	t	5
1350	new test	2025-04-28 22:30:21.90483+00	19	27	t	5
1375	testt	2025-04-28 23:00:16.25462+00	78	27	f	5
1376	testt	2025-04-28 23:00:16.454376+00	79	27	f	5
1377	testt	2025-04-28 23:00:16.572837+00	80	27	f	5
1378	testt	2025-04-28 23:00:16.667632+00	81	27	f	5
1379	testt	2025-04-28 23:00:16.767488+00	82	27	f	5
1380	testt	2025-04-28 23:00:16.875127+00	83	27	f	5
1381	testt	2025-04-28 23:00:16.975171+00	84	27	f	5
1382	testt	2025-04-28 23:00:17.071842+00	85	27	f	5
1383	testt	2025-04-28 23:00:17.172961+00	86	27	f	5
1384	testt	2025-04-28 23:00:17.271972+00	87	27	f	5
1385	testt	2025-04-28 23:00:17.374742+00	88	27	f	5
1386	testt	2025-04-28 23:00:17.471437+00	89	27	f	5
1387	testt	2025-04-28 23:00:17.569621+00	90	27	f	5
1388	testt	2025-04-28 23:00:17.669906+00	91	27	f	5
1389	testt	2025-04-28 23:00:17.771762+00	92	27	f	5
1390	testt	2025-04-28 23:00:17.869838+00	93	27	f	5
1391	testt	2025-04-28 23:00:17.969877+00	94	27	f	5
1392	testt	2025-04-28 23:00:18.069477+00	95	27	f	5
1395	testt	2025-04-28 23:00:18.368251+00	96	27	f	5
1396	testt	2025-04-28 23:00:18.467209+00	68	27	f	5
1397	testt	2025-04-28 23:00:18.5703+00	69	27	f	5
1398	testt	2025-04-28 23:00:18.665837+00	70	27	f	5
1399	testt	2025-04-28 23:00:18.760515+00	71	27	f	5
1400	testt	2025-04-28 23:00:18.857978+00	72	27	f	5
1401	testt	2025-04-28 23:00:18.958275+00	73	27	f	5
1402	testt	2025-04-28 23:00:19.069241+00	74	27	f	5
1403	testt	2025-04-28 23:00:19.175313+00	75	27	f	5
1404	testt	2025-04-28 23:00:19.277104+00	76	27	f	5
1405	testt	2025-04-28 23:00:19.374096+00	77	27	f	5
1406	testt	2025-04-28 23:00:19.473661+00	97	27	f	5
1407	testt	2025-04-28 23:00:19.569857+00	98	27	f	5
1408	testt	2025-04-28 23:00:19.66912+00	99	27	f	5
1409	testt	2025-04-28 23:00:19.767779+00	100	27	f	5
1410	testt	2025-04-28 23:00:19.86813+00	101	27	f	5
1411	testt	2025-04-28 23:00:19.971171+00	102	27	f	5
1412	testt	2025-04-28 23:00:20.077944+00	103	27	f	5
1413	testt	2025-04-28 23:00:20.183152+00	104	27	f	5
1414	testt	2025-04-28 23:00:20.277023+00	105	27	f	5
1415	testt	2025-04-28 23:00:20.373226+00	106	27	f	5
1416	testt	2025-04-28 23:00:20.471783+00	109	27	f	5
1417	testt	2025-04-28 23:00:20.571958+00	110	27	f	5
1420	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:50.324856+00	78	27	f	5
1421	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:50.523592+00	79	27	f	5
1422	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:50.62369+00	80	27	f	5
1423	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:50.726801+00	81	27	f	5
1424	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:50.826922+00	82	27	f	5
1425	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:50.919998+00	83	27	f	5
1426	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.016832+00	84	27	f	5
1427	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.114271+00	85	27	f	5
1575	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.41441+00	71	27	f	5
1393	testt	2025-04-28 23:00:18.170019+00	19	27	t	5
1428	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.210515+00	86	27	f	5
1429	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.312552+00	87	27	f	5
1430	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.414774+00	88	27	f	5
1431	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.508154+00	89	27	f	5
1432	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.603906+00	90	27	f	5
1433	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.70145+00	91	27	f	5
1434	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.796275+00	92	27	f	5
1435	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.888752+00	93	27	f	5
1436	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:51.98741+00	94	27	f	5
1437	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.087093+00	95	27	f	5
1440	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.375627+00	96	27	f	5
1441	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.47182+00	68	27	f	5
1442	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.566275+00	69	27	f	5
1443	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.665001+00	70	27	f	5
1444	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.761062+00	71	27	f	5
1445	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.861636+00	72	27	f	5
1446	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.961758+00	73	27	f	5
1447	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.063184+00	74	27	f	5
1448	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.167835+00	75	27	f	5
1449	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.266781+00	76	27	f	5
1450	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.37273+00	77	27	f	5
1451	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.471104+00	97	27	f	5
1452	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.572062+00	98	27	f	5
1453	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.668377+00	99	27	f	5
1454	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.763115+00	100	27	f	5
1455	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.865681+00	101	27	f	5
1456	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:53.963174+00	102	27	f	5
1457	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:54.063163+00	103	27	f	5
1458	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:54.160128+00	104	27	f	5
1459	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:54.25985+00	105	27	f	5
1460	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:54.358569+00	106	27	f	5
1461	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:54.458146+00	109	27	f	5
1576	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.509691+00	72	27	f	5
1438	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.183487+00	19	27	t	5
1462	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:54.551495+00	110	27	f	5
1464	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:05.965495+00	78	27	f	5
1465	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.17984+00	79	27	f	5
1466	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.277212+00	80	27	f	5
1467	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.369576+00	81	27	f	5
1468	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.465664+00	82	27	f	5
1469	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.565305+00	83	27	f	5
1470	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.669242+00	84	27	f	5
1471	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.765722+00	85	27	f	5
1472	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.85604+00	86	27	f	5
1473	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:06.946767+00	87	27	f	5
1474	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.045364+00	88	27	f	5
1475	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.135318+00	89	27	f	5
1476	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.231933+00	90	27	f	5
1477	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.332516+00	91	27	f	5
1478	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.423939+00	92	27	f	5
1479	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.526214+00	93	27	f	5
1480	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.631584+00	94	27	f	5
1481	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.727615+00	95	27	f	5
1484	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.013363+00	96	27	f	5
1485	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.111891+00	68	27	f	5
1486	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.219671+00	69	27	f	5
1487	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.319955+00	70	27	f	5
1488	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.419343+00	71	27	f	5
1489	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.520352+00	72	27	f	5
1490	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.631913+00	73	27	f	5
1491	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.734192+00	74	27	f	5
1492	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.836461+00	75	27	f	5
1493	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:08.933028+00	76	27	f	5
1494	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.033611+00	77	27	f	5
1495	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.124457+00	97	27	f	5
1496	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.233324+00	98	27	f	5
1482	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.823432+00	19	27	t	5
1497	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.33994+00	99	27	f	5
1498	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.433128+00	100	27	f	5
1499	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.525181+00	101	27	f	5
1500	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.618428+00	102	27	f	5
1501	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.714296+00	103	27	f	5
1502	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.811231+00	104	27	f	5
1503	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:09.901402+00	105	27	f	5
1504	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:10.000498+00	106	27	f	5
1505	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:10.092052+00	109	27	f	5
1506	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:10.183777+00	110	27	f	5
1508	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:03.664096+00	78	27	f	5
1509	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:03.882191+00	79	27	f	5
1510	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:03.979022+00	80	27	f	5
1511	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.078805+00	81	27	f	5
1512	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.178798+00	82	27	f	5
1513	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.285352+00	83	27	f	5
1514	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.387382+00	84	27	f	5
1515	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.48615+00	85	27	f	5
1516	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.587172+00	86	27	f	5
1517	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.685709+00	87	27	f	5
1518	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.788527+00	88	27	f	5
1519	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.88737+00	89	27	f	5
1520	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:04.990396+00	90	27	f	5
1521	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.09453+00	91	27	f	5
1522	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.189989+00	92	27	f	5
1523	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.289874+00	93	27	f	5
1524	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.397665+00	94	27	f	5
1525	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.504592+00	95	27	f	5
1528	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.801236+00	96	27	f	5
1529	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.899199+00	68	27	f	5
1577	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.612157+00	73	27	f	5
1526	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.600522+00	19	27	t	5
1530	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.008132+00	69	27	f	5
1531	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.122851+00	70	27	f	5
1532	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.234716+00	71	27	f	5
1533	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.336184+00	72	27	f	5
1534	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.430329+00	73	27	f	5
1535	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.53935+00	74	27	f	5
1536	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.639541+00	75	27	f	5
1537	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.744887+00	76	27	f	5
1538	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.847714+00	77	27	f	5
1539	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:06.946893+00	97	27	f	5
1540	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.048418+00	98	27	f	5
1541	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.152782+00	99	27	f	5
1542	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.254865+00	100	27	f	5
1543	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.35734+00	101	27	f	5
1544	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.457753+00	102	27	f	5
1545	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.554003+00	103	27	f	5
1546	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.651969+00	104	27	f	5
1547	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.754619+00	105	27	f	5
1548	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.850901+00	106	27	f	5
1549	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:07.950131+00	109	27	f	5
1550	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:08.055082+00	110	27	f	5
1551	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:37.841231+00	78	27	f	5
1552	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.046707+00	79	27	f	5
1553	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.143266+00	80	27	f	5
1554	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.326124+00	81	27	f	5
1555	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.425441+00	82	27	f	5
1556	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.525681+00	83	27	f	5
1557	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.624067+00	84	27	f	5
1558	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.715443+00	85	27	f	5
1559	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.813104+00	86	27	f	5
1560	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:38.908007+00	87	27	f	5
1561	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.01717+00	88	27	f	5
1562	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.114607+00	89	27	f	5
1563	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.213742+00	90	27	f	5
1564	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.311845+00	91	27	f	5
1565	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.41363+00	92	27	f	5
1566	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.508064+00	93	27	f	5
1567	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.611229+00	94	27	f	5
1568	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.710063+00	95	27	f	5
1571	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.010225+00	96	27	f	5
1572	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.112441+00	68	27	f	5
1573	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.216581+00	69	27	f	5
1574	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.315361+00	70	27	f	5
1569	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.8081+00	19	27	t	5
1578	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.712247+00	74	27	f	5
1579	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.813256+00	75	27	f	5
1580	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:40.915094+00	76	27	f	5
1581	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.012939+00	77	27	f	5
1582	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.117612+00	97	27	f	5
1583	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.219626+00	98	27	f	5
1584	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.315625+00	99	27	f	5
1585	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.415758+00	100	27	f	5
1586	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.51688+00	101	27	f	5
1587	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.612652+00	102	27	f	5
1588	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.712886+00	103	27	f	5
1589	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.812938+00	104	27	f	5
1590	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:41.919081+00	105	27	f	5
1591	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:42.019441+00	106	27	f	5
1592	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:42.119466+00	109	27	f	5
1593	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:42.220601+00	110	27	f	5
1594	A new exam "Exam 47" has been scheduled for you at 4/29/2025, 6:27:00 AM.	2025-04-29 00:26:01.64786+00	18	27	t	\N
1331	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 22:12:23.780991+00	18	27	t	\N
1351	new test	2025-04-28 22:30:22.017095+00	18	27	t	5
1394	testt	2025-04-28 23:00:18.274312+00	18	27	t	5
1418	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:20:48.19322+00	18	27	t	\N
1419	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-04-28 23:27:18.47003+00	18	27	t	\N
1439	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-28 23:54:52.280275+00	18	27	t	5
1463	Alhamd lel lah rabb el 3alameen third time	2025-04-28 23:55:27.970117+00	18	27	t	\N
1483	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-29 00:05:07.917392+00	18	27	t	5
1507	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:14:51.622676+00	18	27	t	\N
1527	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-29 00:24:05.700321+00	18	27	t	5
1570	New lab "Python Lab 2.pdf" has been uploaded.	2025-04-29 00:24:39.912049+00	18	27	t	5
1599	testt	2025-04-30 21:36:27.844846+00	78	40	f	5
1600	testt	2025-04-30 21:36:28.054554+00	79	40	f	5
1601	testt	2025-04-30 21:36:28.139115+00	80	40	f	5
1602	testt	2025-04-30 21:36:28.222869+00	81	40	f	5
1603	testt	2025-04-30 21:36:28.303804+00	82	40	f	5
1604	testt	2025-04-30 21:36:28.382719+00	83	40	f	5
1605	testt	2025-04-30 21:36:28.464327+00	84	40	f	5
1606	testt	2025-04-30 21:36:28.565041+00	85	40	f	5
1607	testt	2025-04-30 21:36:28.642781+00	86	40	f	5
1608	testt	2025-04-30 21:36:28.732874+00	87	40	f	5
1609	testt	2025-04-30 21:36:28.815868+00	88	40	f	5
1610	testt	2025-04-30 21:36:28.909817+00	89	40	f	5
1611	testt	2025-04-30 21:36:29.002715+00	90	40	f	5
1612	testt	2025-04-30 21:36:29.103757+00	91	40	f	5
1613	testt	2025-04-30 21:36:29.211747+00	92	40	f	5
1614	testt	2025-04-30 21:36:29.291345+00	93	40	f	5
1615	testt	2025-04-30 21:36:29.373072+00	94	40	f	5
1616	testt	2025-04-30 21:36:29.462953+00	95	40	f	5
1619	testt	2025-04-30 21:36:29.82679+00	96	40	f	5
1620	testt	2025-04-30 21:36:29.940612+00	68	40	f	5
1621	testt	2025-04-30 21:36:30.035469+00	69	40	f	5
1622	testt	2025-04-30 21:36:30.125051+00	70	40	f	5
1623	testt	2025-04-30 21:36:30.241125+00	71	40	f	5
1624	testt	2025-04-30 21:36:30.319686+00	72	40	f	5
1625	testt	2025-04-30 21:36:30.404326+00	73	40	f	5
1626	testt	2025-04-30 21:36:30.508466+00	74	40	f	5
1627	testt	2025-04-30 21:36:30.598721+00	75	40	f	5
1628	testt	2025-04-30 21:36:30.704671+00	76	40	f	5
1629	testt	2025-04-30 21:36:30.786804+00	77	40	f	5
1630	testt	2025-04-30 21:36:30.872278+00	97	40	f	5
1631	testt	2025-04-30 21:36:30.951269+00	98	40	f	5
1632	testt	2025-04-30 21:36:31.037232+00	99	40	f	5
1633	testt	2025-04-30 21:36:31.118375+00	100	40	f	5
1634	testt	2025-04-30 21:36:31.239446+00	101	40	f	5
1635	testt	2025-04-30 21:36:31.340573+00	102	40	f	5
1636	testt	2025-04-30 21:36:31.427718+00	103	40	f	5
1595	A new exam "Exam 48" has been scheduled for you at 4/29/2025, 7:31:00 AM.	2025-04-29 01:30:44.517233+00	19	40	t	\N
1618	testt	2025-04-30 21:36:29.676811+00	18	40	t	5
1637	testt	2025-04-30 21:36:31.50681+00	104	40	f	5
1638	testt	2025-04-30 21:36:31.587002+00	105	40	f	5
1639	testt	2025-04-30 21:36:31.670864+00	106	40	f	5
1640	testt	2025-04-30 21:36:31.754497+00	109	40	f	5
1641	testt	2025-04-30 21:36:31.833743+00	110	40	f	5
1596	A new exam "Exam 48" has been scheduled for you at 4/29/2025, 8:12:00 AM.	2025-04-29 02:11:57.88309+00	19	40	t	\N
1597	A new exam "Exam 48" has been scheduled for you at 4/29/2025, 8:23:00 AM.	2025-04-29 02:22:12.816334+00	19	31	t	\N
1598	A new exam "Exam 48" has been scheduled for you at 4/29/2025, 8:33:00 AM.	2025-04-29 02:32:43.239241+00	19	31	t	\N
1617	testt	2025-04-30 21:36:29.580062+00	19	40	t	5
1643	A new exam "Exam 48" has been scheduled for you at 5/1/2025, 5:45:00 AM.	2025-04-30 23:44:33.144276+00	19	40	t	\N
1642	A new exam "Exam 48" has been scheduled for you at 5/1/2025, 5:31:00 AM.	2025-04-30 23:30:25.547977+00	19	40	t	\N
1645	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:32.653359+00	78	40	f	5
1646	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:33.2901+00	79	40	f	5
1647	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:33.816767+00	80	40	f	5
1648	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:34.344741+00	81	40	f	5
1649	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:34.813079+00	82	40	f	5
1650	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:35.319468+00	83	40	f	5
1651	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:35.939189+00	84	40	f	5
1652	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:36.440242+00	85	40	f	5
1653	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:37.001839+00	86	40	f	5
1654	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:37.532723+00	87	40	f	5
1655	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:38.035592+00	88	40	f	5
1656	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:38.492715+00	89	40	f	5
1657	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:38.995144+00	90	40	f	5
1658	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:41.53199+00	91	40	f	5
1659	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:48.839965+00	92	40	f	5
1660	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:52.774674+00	93	40	f	5
1661	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:53.708846+00	94	40	f	5
1662	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:54.851318+00	95	40	f	5
1664	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:58.098317+00	96	40	f	5
1665	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:58.758836+00	68	40	f	5
1666	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:59.341161+00	69	40	f	5
1667	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:59.87452+00	70	40	f	5
1668	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:00.376943+00	71	40	f	5
1669	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:00.970458+00	72	40	f	5
1670	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:01.510294+00	73	40	f	5
1671	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:02.124877+00	74	40	f	5
1672	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:02.756334+00	75	40	f	5
1644	A new exam "Exam 51" has been scheduled for you at 5/2/2025, 3:40:00 AM.	2025-05-01 21:39:18.678446+00	19	31	t	\N
1916	testt	2025-05-02 00:28:49.499752+00	78	40	f	5
1673	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:03.464224+00	76	40	f	5
1674	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:04.071028+00	77	40	f	5
1675	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:04.66329+00	97	40	f	5
1676	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:05.241088+00	98	40	f	5
1677	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:05.813155+00	99	40	f	5
1678	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:06.288072+00	100	40	f	5
1679	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:06.808093+00	101	40	f	5
1680	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:07.278437+00	102	40	f	5
1681	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:07.780565+00	103	40	f	5
1682	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:08.200461+00	104	40	f	5
1683	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:08.656141+00	105	40	f	5
1684	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:09.111202+00	106	40	f	5
1686	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:10.077713+00	109	40	f	5
1687	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:10.58479+00	110	40	f	5
1688	test push noti	2025-05-01 22:14:43.791422+00	78	40	f	5
1689	test push noti	2025-05-01 22:14:44.443739+00	79	40	f	5
1690	test push noti	2025-05-01 22:14:44.963565+00	80	40	f	5
1691	test push noti	2025-05-01 22:14:45.482539+00	81	40	f	5
1692	test push noti	2025-05-01 22:14:46.292449+00	82	40	f	5
1693	test push noti	2025-05-01 22:14:46.925054+00	83	40	f	5
1694	test push noti	2025-05-01 22:14:47.436973+00	84	40	f	5
1695	test push noti	2025-05-01 22:14:48.159133+00	85	40	f	5
1696	test push noti	2025-05-01 22:14:48.633582+00	86	40	f	5
1697	test push noti	2025-05-01 22:14:49.256739+00	87	40	f	5
1698	test push noti	2025-05-01 22:14:49.796938+00	88	40	f	5
1699	test push noti	2025-05-01 22:14:50.300287+00	89	40	f	5
1700	test push noti	2025-05-01 22:14:50.942167+00	90	40	f	5
1701	test push noti	2025-05-01 22:14:51.769536+00	91	40	f	5
1702	test push noti	2025-05-01 22:14:52.616792+00	92	40	f	5
1703	test push noti	2025-05-01 22:14:53.309423+00	93	40	f	5
1704	test push noti	2025-05-01 22:14:53.788966+00	94	40	f	5
1705	test push noti	2025-05-01 22:14:54.407522+00	95	40	f	5
1707	test push noti	2025-05-01 22:14:55.632541+00	96	40	f	5
1708	test push noti	2025-05-01 22:14:56.267872+00	68	40	f	5
1709	test push noti	2025-05-01 22:14:56.75413+00	69	40	f	5
1710	test push noti	2025-05-01 22:14:57.33798+00	70	40	f	5
1711	test push noti	2025-05-01 22:14:57.796678+00	71	40	f	5
1712	test push noti	2025-05-01 22:14:58.404549+00	72	40	f	5
1713	test push noti	2025-05-01 22:14:58.989534+00	73	40	f	5
1714	test push noti	2025-05-01 22:14:59.557341+00	74	40	f	5
1715	test push noti	2025-05-01 22:15:00.275452+00	75	40	f	5
1716	test push noti	2025-05-01 22:15:00.745369+00	76	40	f	5
1717	test push noti	2025-05-01 22:15:01.351373+00	77	40	f	5
1718	test push noti	2025-05-01 22:15:01.96762+00	97	40	f	5
1719	test push noti	2025-05-01 22:15:05.665074+00	98	40	f	5
1720	test push noti	2025-05-01 22:15:06.430928+00	99	40	f	5
1721	test push noti	2025-05-01 22:15:09.131212+00	100	40	f	5
1722	test push noti	2025-05-01 22:15:09.912269+00	101	40	f	5
1723	test push noti	2025-05-01 22:15:10.433538+00	102	40	f	5
1724	test push noti	2025-05-01 22:15:10.964275+00	103	40	f	5
1725	test push noti	2025-05-01 22:15:11.617201+00	104	40	f	5
1726	test push noti	2025-05-01 22:15:12.201579+00	105	40	f	5
1727	test push noti	2025-05-01 22:15:12.854151+00	106	40	f	5
1729	test push noti	2025-05-01 22:15:14.428878+00	109	40	f	5
1730	test push noti	2025-05-01 22:15:14.931805+00	110	40	f	5
1731	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:19.556763+00	78	40	f	5
1732	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:20.20536+00	79	40	f	5
1728	test push noti	2025-05-01 22:15:13.502218+00	19	40	t	5
1825	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:32.067937+00	84	31	f	\N
1826	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:33.548885+00	85	31	f	\N
1917	testt	2025-05-02 00:28:50.212456+00	79	40	f	5
1733	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:20.72988+00	80	40	f	5
1734	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:21.457209+00	81	40	f	5
1735	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:21.943417+00	82	40	f	5
1736	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:22.521715+00	83	40	f	5
1737	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:22.998695+00	84	40	f	5
1738	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:23.530156+00	85	40	f	5
1739	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:23.994463+00	86	40	f	5
1740	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:24.471882+00	87	40	f	5
1741	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:25.096415+00	88	40	f	5
1742	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:25.581582+00	89	40	f	5
1743	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:26.118161+00	90	40	f	5
1744	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:26.643523+00	91	40	f	5
1745	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:27.218614+00	92	40	f	5
1746	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:27.618831+00	93	40	f	5
1747	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:28.123809+00	94	40	f	5
1748	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:28.538029+00	95	40	f	5
1750	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:29.502658+00	96	40	f	5
1751	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:29.989666+00	68	40	f	5
1752	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:30.537316+00	69	40	f	5
1753	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:31.015868+00	70	40	f	5
1754	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:31.6052+00	71	40	f	5
1755	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:32.072033+00	72	40	f	5
1756	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:32.546358+00	73	40	f	5
1757	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:33.011379+00	74	40	f	5
1758	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:33.450866+00	75	40	f	5
1759	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:33.871597+00	76	40	f	5
1760	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:34.324809+00	77	40	f	5
1761	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:34.795703+00	97	40	f	5
1762	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:35.279485+00	98	40	f	5
1763	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:35.72631+00	99	40	f	5
1764	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:36.203074+00	100	40	f	5
1765	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:36.677884+00	101	40	f	5
1910	tessssssssssssssssssss	2025-05-02 00:25:56.794024+00	104	40	f	5
1766	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:37.158513+00	102	40	f	5
1767	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:37.632927+00	103	40	f	5
1768	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:38.078222+00	104	40	f	5
1769	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:38.587007+00	105	40	f	5
1770	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:39.082298+00	106	40	f	5
1772	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:40.172868+00	109	40	f	5
1773	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:40.578357+00	110	40	f	5
1685	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:13:09.512379+00	19	40	t	5
1771	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:39.630724+00	19	40	t	5
1774	tessssssssssssssssssss	2025-05-01 22:19:16.613824+00	19	40	t	\N
1775	tessssssssssssssssssss	2025-05-01 23:11:29.737013+00	78	40	f	5
1776	tessssssssssssssssssss	2025-05-01 23:11:30.433477+00	79	40	f	5
1777	tessssssssssssssssssss	2025-05-01 23:11:30.941733+00	80	40	f	5
1778	tessssssssssssssssssss	2025-05-01 23:11:31.630236+00	81	40	f	5
1779	tessssssssssssssssssss	2025-05-01 23:11:32.21684+00	82	40	f	5
1780	tessssssssssssssssssss	2025-05-01 23:11:33.274134+00	83	40	f	5
1781	tessssssssssssssssssss	2025-05-01 23:11:34.145968+00	84	40	f	5
1782	tessssssssssssssssssss	2025-05-01 23:11:35.344081+00	85	40	f	5
1783	tessssssssssssssssssss	2025-05-01 23:11:36.137296+00	86	40	f	5
1784	tessssssssssssssssssss	2025-05-01 23:11:37.4752+00	87	40	f	5
1785	tessssssssssssssssssss	2025-05-01 23:11:38.409658+00	88	40	f	5
1786	tessssssssssssssssssss	2025-05-01 23:11:39.571501+00	89	40	f	5
1787	tessssssssssssssssssss	2025-05-01 23:11:40.635062+00	90	40	f	5
1788	tessssssssssssssssssss	2025-05-01 23:11:41.327511+00	91	40	f	5
1789	tessssssssssssssssssss	2025-05-01 23:11:42.046787+00	92	40	f	5
1790	tessssssssssssssssssss	2025-05-01 23:11:42.591874+00	93	40	f	5
1791	tessssssssssssssssssss	2025-05-01 23:11:43.183636+00	94	40	f	5
1792	tessssssssssssssssssss	2025-05-01 23:11:43.653217+00	95	40	f	5
1794	tessssssssssssssssssss	2025-05-01 23:11:44.718549+00	96	40	f	5
1795	tessssssssssssssssssss	2025-05-01 23:11:45.434106+00	68	40	f	5
1796	tessssssssssssssssssss	2025-05-01 23:11:46.04685+00	69	40	f	5
1797	tessssssssssssssssssss	2025-05-01 23:11:46.531363+00	70	40	f	5
1798	tessssssssssssssssssss	2025-05-01 23:11:47.223638+00	71	40	f	5
1799	tessssssssssssssssssss	2025-05-01 23:11:47.750209+00	72	40	f	5
1800	tessssssssssssssssssss	2025-05-01 23:11:48.309241+00	73	40	f	5
1801	tessssssssssssssssssss	2025-05-01 23:11:48.874267+00	74	40	f	5
1802	tessssssssssssssssssss	2025-05-01 23:11:49.491355+00	75	40	f	5
1803	tessssssssssssssssssss	2025-05-01 23:11:50.186216+00	76	40	f	5
1804	tessssssssssssssssssss	2025-05-01 23:11:50.861346+00	77	40	f	5
1805	tessssssssssssssssssss	2025-05-01 23:11:51.348333+00	97	40	f	5
1806	tessssssssssssssssssss	2025-05-01 23:11:51.875612+00	98	40	f	5
1807	tessssssssssssssssssss	2025-05-01 23:11:52.404017+00	99	40	f	5
1808	tessssssssssssssssssss	2025-05-01 23:11:52.988616+00	100	40	f	5
1809	tessssssssssssssssssss	2025-05-01 23:11:53.463915+00	101	40	f	5
1810	tessssssssssssssssssss	2025-05-01 23:11:53.979588+00	102	40	f	5
1811	tessssssssssssssssssss	2025-05-01 23:11:54.53372+00	103	40	f	5
1812	tessssssssssssssssssss	2025-05-01 23:11:55.166604+00	104	40	f	5
1813	tessssssssssssssssssss	2025-05-01 23:11:55.677309+00	105	40	f	5
1814	tessssssssssssssssssss	2025-05-01 23:11:56.293678+00	106	40	f	5
1816	tessssssssssssssssssss	2025-05-01 23:11:57.363245+00	109	40	f	5
1817	tessssssssssssssssssss	2025-05-01 23:11:58.141944+00	110	40	f	5
1815	tessssssssssssssssssss	2025-05-01 23:11:56.877642+00	19	40	t	5
1819	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:23.787174+00	78	31	f	\N
1820	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:25.120539+00	79	31	f	\N
1821	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:26.497354+00	80	31	f	\N
1822	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:27.974763+00	81	31	f	\N
1823	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:29.33482+00	82	31	f	\N
1824	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:30.704955+00	83	31	f	\N
1911	tessssssssssssssssssss	2025-05-02 00:25:56.897742+00	105	40	f	5
1912	tessssssssssssssssssss	2025-05-02 00:25:56.98121+00	106	40	f	5
1914	tessssssssssssssssssss	2025-05-02 00:25:57.162118+00	109	40	f	5
1915	tessssssssssssssssssss	2025-05-02 00:25:57.254685+00	110	40	f	5
1793	tessssssssssssssssssss	2025-05-01 23:11:44.204993+00	18	40	t	5
1827	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:34.969166+00	86	31	f	\N
1828	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:36.361738+00	87	31	f	\N
1829	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:37.784441+00	88	31	f	\N
1830	test push	2025-05-02 00:16:23.188915+00	78	40	f	5
1831	test push	2025-05-02 00:16:23.407859+00	79	40	f	5
1832	test push	2025-05-02 00:16:23.507943+00	80	40	f	5
1833	test push	2025-05-02 00:16:23.64408+00	81	40	f	5
1834	test push	2025-05-02 00:16:23.734287+00	82	40	f	5
1835	test push	2025-05-02 00:16:23.867374+00	83	40	f	5
1836	test push	2025-05-02 00:16:23.987881+00	84	40	f	5
1837	test push	2025-05-02 00:16:24.151387+00	85	40	f	5
1838	test push	2025-05-02 00:16:24.251543+00	86	40	f	5
1839	test push	2025-05-02 00:16:24.341091+00	87	40	f	5
1840	test push	2025-05-02 00:16:24.44793+00	88	40	f	5
1841	test push	2025-05-02 00:16:24.567639+00	89	40	f	5
1842	test push	2025-05-02 00:16:24.669401+00	90	40	f	5
1843	test push	2025-05-02 00:16:24.759661+00	91	40	f	5
1844	test push	2025-05-02 00:16:24.872431+00	92	40	f	5
1845	test push	2025-05-02 00:16:24.953794+00	93	40	f	5
1846	test push	2025-05-02 00:16:25.088246+00	94	40	f	5
1847	test push	2025-05-02 00:16:25.222269+00	95	40	f	5
1849	test push	2025-05-02 00:16:25.387341+00	96	40	f	5
1850	test push	2025-05-02 00:16:25.46674+00	68	40	f	5
1851	test push	2025-05-02 00:16:25.585077+00	69	40	f	5
1852	test push	2025-05-02 00:16:25.668708+00	70	40	f	5
1853	test push	2025-05-02 00:16:25.798165+00	71	40	f	5
1854	test push	2025-05-02 00:16:25.879469+00	72	40	f	5
1855	test push	2025-05-02 00:16:25.991917+00	73	40	f	5
1856	test push	2025-05-02 00:16:26.106971+00	74	40	f	5
1857	test push	2025-05-02 00:16:26.220609+00	75	40	f	5
1858	test push	2025-05-02 00:16:26.351467+00	76	40	f	5
1859	test push	2025-05-02 00:16:26.441255+00	77	40	f	5
1860	test push	2025-05-02 00:16:26.523538+00	97	40	f	5
1861	test push	2025-05-02 00:16:26.630089+00	98	40	f	5
1862	test push	2025-05-02 00:16:26.713021+00	99	40	f	5
1863	test push	2025-05-02 00:16:26.800399+00	100	40	f	5
1864	test push	2025-05-02 00:16:26.939828+00	101	40	f	5
1865	test push	2025-05-02 00:16:27.094105+00	102	40	f	5
1866	test push	2025-05-02 00:16:27.209886+00	103	40	f	5
1867	test push	2025-05-02 00:16:27.309977+00	104	40	f	5
1868	test push	2025-05-02 00:16:27.434882+00	105	40	f	5
1869	test push	2025-05-02 00:16:27.518983+00	106	40	f	5
1871	test push	2025-05-02 00:16:27.721856+00	109	40	f	5
1872	test push	2025-05-02 00:16:27.989125+00	110	40	f	5
1873	tessssssssssssssssssss	2025-05-02 00:25:52.994114+00	78	40	f	5
1874	tessssssssssssssssssss	2025-05-02 00:25:53.162601+00	79	40	f	5
1875	tessssssssssssssssssss	2025-05-02 00:25:53.240468+00	80	40	f	5
1876	tessssssssssssssssssss	2025-05-02 00:25:53.334478+00	81	40	f	5
1877	tessssssssssssssssssss	2025-05-02 00:25:53.429084+00	82	40	f	5
1878	tessssssssssssssssssss	2025-05-02 00:25:53.514526+00	83	40	f	5
1879	tessssssssssssssssssss	2025-05-02 00:25:53.595831+00	84	40	f	5
1880	tessssssssssssssssssss	2025-05-02 00:25:53.69924+00	85	40	f	5
1881	tessssssssssssssssssss	2025-05-02 00:25:53.784808+00	86	40	f	5
1882	tessssssssssssssssssss	2025-05-02 00:25:53.863948+00	87	40	f	5
1883	tessssssssssssssssssss	2025-05-02 00:25:53.959572+00	88	40	f	5
1884	tessssssssssssssssssss	2025-05-02 00:25:54.072677+00	89	40	f	5
1885	tessssssssssssssssssss	2025-05-02 00:25:54.203798+00	90	40	f	5
1886	tessssssssssssssssssss	2025-05-02 00:25:54.312686+00	91	40	f	5
1887	tessssssssssssssssssss	2025-05-02 00:25:54.410001+00	92	40	f	5
1888	tessssssssssssssssssss	2025-05-02 00:25:54.542226+00	93	40	f	5
1889	tessssssssssssssssssss	2025-05-02 00:25:54.623918+00	94	40	f	5
1890	tessssssssssssssssssss	2025-05-02 00:25:54.715986+00	95	40	f	5
1892	tessssssssssssssssssss	2025-05-02 00:25:54.925638+00	96	40	f	5
1893	tessssssssssssssssssss	2025-05-02 00:25:55.024376+00	68	40	f	5
1894	tessssssssssssssssssss	2025-05-02 00:25:55.186224+00	69	40	f	5
1895	tessssssssssssssssssss	2025-05-02 00:25:55.289317+00	70	40	f	5
1896	tessssssssssssssssssss	2025-05-02 00:25:55.391042+00	71	40	f	5
1897	tessssssssssssssssssss	2025-05-02 00:25:55.485272+00	72	40	f	5
1898	tessssssssssssssssssss	2025-05-02 00:25:55.568711+00	73	40	f	5
1899	tessssssssssssssssssss	2025-05-02 00:25:55.646335+00	74	40	f	5
1900	tessssssssssssssssssss	2025-05-02 00:25:55.734894+00	75	40	f	5
1901	tessssssssssssssssssss	2025-05-02 00:25:55.848164+00	76	40	f	5
1902	tessssssssssssssssssss	2025-05-02 00:25:55.976834+00	77	40	f	5
1903	tessssssssssssssssssss	2025-05-02 00:25:56.086946+00	97	40	f	5
1904	tessssssssssssssssssss	2025-05-02 00:25:56.208738+00	98	40	f	5
1905	tessssssssssssssssssss	2025-05-02 00:25:56.335117+00	99	40	f	5
1906	tessssssssssssssssssss	2025-05-02 00:25:56.438773+00	100	40	f	5
1907	tessssssssssssssssssss	2025-05-02 00:25:56.516196+00	101	40	f	5
1908	tessssssssssssssssssss	2025-05-02 00:25:56.621667+00	102	40	f	5
1909	tessssssssssssssssssss	2025-05-02 00:25:56.706191+00	103	40	f	5
1848	test push	2025-05-02 00:16:25.307182+00	18	40	t	5
1918	testt	2025-05-02 00:28:50.671154+00	80	40	f	5
1919	testt	2025-05-02 00:28:51.103141+00	81	40	f	5
1920	testt	2025-05-02 00:28:51.659658+00	82	40	f	5
1921	testt	2025-05-02 00:28:52.104821+00	83	40	f	5
1922	testt	2025-05-02 00:28:52.695026+00	84	40	f	5
1923	testt	2025-05-02 00:28:53.17674+00	85	40	f	5
1924	testt	2025-05-02 00:28:53.663346+00	86	40	f	5
1925	testt	2025-05-02 00:28:54.090414+00	87	40	f	5
1926	testt	2025-05-02 00:28:54.516257+00	88	40	f	5
1927	testt	2025-05-02 00:28:55.036379+00	89	40	f	5
1928	testt	2025-05-02 00:28:55.539674+00	90	40	f	5
1929	testt	2025-05-02 00:28:55.972336+00	91	40	f	5
1930	testt	2025-05-02 00:28:56.426018+00	92	40	f	5
1931	testt	2025-05-02 00:28:56.89893+00	93	40	f	5
1932	testt	2025-05-02 00:28:57.40728+00	94	40	f	5
1933	testt	2025-05-02 00:28:57.877889+00	95	40	f	5
1935	testt	2025-05-02 00:28:58.730627+00	96	40	f	5
1936	testt	2025-05-02 00:28:59.174335+00	68	40	f	5
1937	testt	2025-05-02 00:28:59.602569+00	69	40	f	5
1938	testt	2025-05-02 00:29:00.073834+00	70	40	f	5
1939	testt	2025-05-02 00:29:00.508502+00	71	40	f	5
1940	testt	2025-05-02 00:29:00.938356+00	72	40	f	5
1941	testt	2025-05-02 00:29:01.373956+00	73	40	f	5
1942	testt	2025-05-02 00:29:01.785707+00	74	40	f	5
1943	testt	2025-05-02 00:29:02.270345+00	75	40	f	5
1944	testt	2025-05-02 00:29:02.84211+00	76	40	f	5
1945	testt	2025-05-02 00:29:03.353376+00	77	40	f	5
1946	testt	2025-05-02 00:29:03.771989+00	97	40	f	5
1947	testt	2025-05-02 00:29:04.259222+00	98	40	f	5
1948	testt	2025-05-02 00:29:04.747733+00	99	40	f	5
1949	testt	2025-05-02 00:29:05.22453+00	100	40	f	5
1950	testt	2025-05-02 00:29:05.688868+00	101	40	f	5
1951	testt	2025-05-02 00:29:06.222807+00	102	40	f	5
1952	testt	2025-05-02 00:29:06.739086+00	103	40	f	5
1953	testt	2025-05-02 00:29:07.332395+00	104	40	f	5
1954	testt	2025-05-02 00:29:07.811824+00	105	40	f	5
1955	testt	2025-05-02 00:29:08.227113+00	106	40	f	5
1957	testt	2025-05-02 00:29:09.928706+00	109	40	f	5
1958	testt	2025-05-02 00:29:10.484003+00	110	40	f	5
1959	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:51.54721+00	78	40	f	5
1960	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:52.075581+00	79	40	f	5
1961	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:52.638265+00	80	40	f	5
1962	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:53.086318+00	81	40	f	5
1963	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:53.514351+00	82	40	f	5
1964	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:54.052353+00	83	40	f	5
1965	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:54.49403+00	84	40	f	5
1966	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:54.977047+00	85	40	f	5
1967	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:55.437522+00	86	40	f	5
1968	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:55.953562+00	87	40	f	5
1969	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:56.582015+00	88	40	f	5
1970	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:57.100424+00	89	40	f	5
1971	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:57.528988+00	90	40	f	5
1972	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:58.024883+00	91	40	f	5
1973	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:58.535487+00	92	40	f	5
1974	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:59.090105+00	93	40	f	5
1975	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:36:59.635474+00	94	40	f	5
1976	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:00.247356+00	95	40	f	5
1978	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:01.294165+00	96	40	f	5
2029	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:32.954221+00	75	40	f	5
1934	testt	2025-05-02 00:28:58.31266+00	18	40	t	5
1979	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:01.830724+00	68	40	f	5
1980	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:02.362419+00	69	40	f	5
1981	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:02.846102+00	70	40	f	5
1982	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:03.389928+00	71	40	f	5
1983	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:03.832952+00	72	40	f	5
1984	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:04.266097+00	73	40	f	5
1985	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:04.721759+00	74	40	f	5
1986	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:05.192833+00	75	40	f	5
1987	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:05.632393+00	76	40	f	5
1988	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:06.074749+00	77	40	f	5
1989	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:06.526069+00	97	40	f	5
1990	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:06.938851+00	98	40	f	5
1991	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:07.465545+00	99	40	f	5
1992	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:07.998617+00	100	40	f	5
1993	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:08.594654+00	101	40	f	5
1994	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:09.108937+00	102	40	f	5
1995	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:09.584923+00	103	40	f	5
1996	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:10.173989+00	104	40	f	5
1997	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:10.640128+00	105	40	f	5
1998	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:11.070629+00	106	40	f	5
2000	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:12.781379+00	109	40	f	5
2001	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:13.224753+00	110	40	f	5
2002	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:20.40805+00	78	40	f	5
2003	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:20.995305+00	79	40	f	5
2004	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:21.436244+00	80	40	f	5
2005	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:21.890103+00	81	40	f	5
2006	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:22.325975+00	82	40	f	5
2007	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:22.803067+00	83	40	f	5
2008	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:23.26053+00	84	40	f	5
2009	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:23.693113+00	85	40	f	5
2010	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:24.102399+00	86	40	f	5
2011	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:24.609291+00	87	40	f	5
2012	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:25.075952+00	88	40	f	5
2013	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:25.541967+00	89	40	f	5
2014	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:25.950244+00	90	40	f	5
2015	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:26.392585+00	91	40	f	5
2016	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:26.944745+00	92	40	f	5
2017	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:27.372402+00	93	40	f	5
2018	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:27.794526+00	94	40	f	5
2019	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:28.324713+00	95	40	f	5
2021	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:29.218803+00	96	40	f	5
2022	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:29.766705+00	68	40	f	5
2023	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:30.282332+00	69	40	f	5
2024	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:30.714742+00	70	40	f	5
2025	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:31.142969+00	71	40	f	5
2026	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:31.58254+00	72	40	f	5
2027	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:31.986343+00	73	40	f	5
2028	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:32.492573+00	74	40	f	5
2020	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:28.787031+00	18	40	t	5
2030	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:33.394264+00	76	40	f	5
2031	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:33.834131+00	77	40	f	5
2032	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:34.274711+00	97	40	f	5
2033	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:34.776154+00	98	40	f	5
2034	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:35.205506+00	99	40	f	5
2035	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:35.695312+00	100	40	f	5
2036	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:36.110462+00	101	40	f	5
2037	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:36.537309+00	102	40	f	5
2038	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:36.978824+00	103	40	f	5
2039	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:37.415292+00	104	40	f	5
2040	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:37.837526+00	105	40	f	5
2041	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:38.318982+00	106	40	f	5
2043	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:39.936368+00	109	40	f	5
2044	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:40.489022+00	110	40	f	5
2045	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:14.126462+00	78	40	f	5
2046	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:14.759978+00	79	40	f	5
2047	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:15.225195+00	80	40	f	5
2048	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:15.658519+00	81	40	f	5
2049	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:16.090561+00	82	40	f	5
2050	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:16.524058+00	83	40	f	5
2051	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:16.968793+00	84	40	f	5
2052	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:17.395366+00	85	40	f	5
2053	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:17.82688+00	86	40	f	5
2054	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:18.292061+00	87	40	f	5
2055	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:18.714449+00	88	40	f	5
2056	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:19.164147+00	89	40	f	5
2057	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:19.638453+00	90	40	f	5
2058	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:20.066485+00	91	40	f	5
2059	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:20.533512+00	92	40	f	5
2060	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:21.017116+00	93	40	f	5
2061	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:21.52949+00	94	40	f	5
2062	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:21.96258+00	95	40	f	5
2064	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:22.865511+00	96	40	f	5
2065	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:23.297919+00	68	40	f	5
2066	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:23.765827+00	69	40	f	5
2067	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:24.20735+00	70	40	f	5
2068	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:24.710213+00	71	40	f	5
2069	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:25.18224+00	72	40	f	5
2070	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:25.591882+00	73	40	f	5
2042	Alhamd lel lah rabb el 3alameen	2025-05-02 00:49:38.745203+00	19	40	t	5
2113	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:43.560956+00	96	31	f	5
2071	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:26.083012+00	74	40	f	5
2072	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:26.503618+00	75	40	f	5
2073	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:26.952816+00	76	40	f	5
2074	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:27.41684+00	77	40	f	5
2075	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:27.853697+00	97	40	f	5
2076	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:28.287223+00	98	40	f	5
2077	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:28.691897+00	99	40	f	5
2078	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:29.156924+00	100	40	f	5
2079	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:29.593918+00	101	40	f	5
2080	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:30.075766+00	102	40	f	5
2081	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:30.509135+00	103	40	f	5
2082	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:30.997513+00	104	40	f	5
2083	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:31.469665+00	105	40	f	5
2084	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:31.88398+00	106	40	f	5
2086	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:32.8643+00	109	40	f	5
2087	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:33.344512+00	110	40	f	5
1818	A new exam "Exam 51" has been scheduled for you at 5/3/2025, 3:30:00 AM.	2025-05-01 23:42:22.305623+00	19	31	t	\N
1913	tessssssssssssssssssss	2025-05-02 00:25:57.073667+00	19	40	t	5
1870	test push	2025-05-02 00:16:27.59895+00	19	40	t	5
1956	testt	2025-05-02 00:29:08.630152+00	19	40	t	5
1999	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:11.583908+00	19	40	t	5
2085	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:32.388705+00	19	40	t	5
2088	A new exam "Exam 65" has been scheduled for you at 5/2/2025, 8:52:00 AM.	2025-05-02 02:50:27.422062+00	19	31	f	\N
2089	A new exam "Exam 65" has been scheduled for you at 5/2/2025, 9:40:00 AM.	2025-05-02 03:39:13.912112+00	19	31	f	\N
2091	A new exam "Exam 65" has been scheduled for you at 5/2/2025, 9:54:00 AM.	2025-05-02 03:53:25.549728+00	19	31	f	\N
2093	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:40.78632+00	78	31	f	5
2094	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:41.05145+00	79	31	f	5
2095	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:41.183011+00	80	31	f	5
2096	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:41.314207+00	81	31	f	5
2097	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:41.4457+00	82	31	f	5
2098	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:41.576907+00	83	31	f	5
2099	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:41.708845+00	84	31	f	5
2100	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:41.839904+00	85	31	f	5
2101	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:41.976189+00	86	31	f	5
2102	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:42.108063+00	87	31	f	5
2103	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:42.242933+00	88	31	f	5
2104	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:42.374571+00	89	31	f	5
2105	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:42.506001+00	90	31	f	5
2106	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:42.637168+00	91	31	f	5
2107	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:42.768404+00	92	31	f	5
2108	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:42.905059+00	93	31	f	5
2109	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:43.03608+00	94	31	f	5
2110	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:43.167175+00	95	31	f	5
2111	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:43.298258+00	19	31	f	5
2090	A new exam "Exam 65" has been scheduled for you at 5/2/2025, 9:40:00 AM.	2025-05-02 03:39:15.513743+00	18	31	t	\N
2092	A new exam "Exam 65" has been scheduled for you at 5/2/2025, 9:54:00 AM.	2025-05-02 03:53:27.224935+00	18	31	t	\N
2114	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:43.691731+00	68	31	f	5
2115	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:43.824424+00	69	31	f	5
2116	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:43.954946+00	70	31	f	5
2117	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:44.085738+00	71	31	f	5
2118	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:44.217206+00	72	31	f	5
2119	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:44.363171+00	73	31	f	5
2120	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:44.495529+00	74	31	f	5
2121	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:44.626861+00	75	31	f	5
2122	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:44.758788+00	76	31	f	5
2123	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:44.889873+00	77	31	f	5
2124	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:45.021709+00	97	31	f	5
2125	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:45.158338+00	98	31	f	5
2126	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:45.291639+00	99	31	f	5
2127	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:45.43849+00	100	31	f	5
2128	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:45.569681+00	101	31	f	5
2129	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:45.701072+00	102	31	f	5
2130	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:45.831873+00	103	31	f	5
2131	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:45.962768+00	104	31	f	5
2132	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:46.094446+00	105	31	f	5
2133	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:46.231394+00	106	31	f	5
2134	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:46.364822+00	109	31	f	5
2135	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:46.496061+00	110	31	f	5
2137	A new exam "Exam 66" has been scheduled for you at 5/2/2025, 11:18:00 AM.	2025-05-02 05:17:31.679096+00	19	31	f	\N
2138	A new exam "Exam 50" has been scheduled for you at 5/2/2025, 11:49:00 AM.	2025-05-02 05:48:39.946427+00	19	31	f	\N
2140	A new exam "Exam 48" has been scheduled for you at 5/2/2025, 6:42:00 PM.	2025-05-02 12:42:01.271025+00	19	40	f	\N
2141	A new exam "Exam 48" has been scheduled for you at 5/2/2025, 6:46:00 PM.	2025-05-02 12:45:58.063691+00	19	40	f	\N
2142	A new exam "Exam 48" has been scheduled for you at 5/2/2025, 6:59:00 PM.	2025-05-02 12:58:21.171424+00	19	40	f	\N
2143	A new exam "Exam 48" has been scheduled for you at 5/2/2025, 7:01:00 PM.	2025-05-02 13:00:45.467532+00	19	40	f	\N
2144	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:01.073938+00	78	30	f	5
2145	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:01.853071+00	79	30	f	5
2146	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:02.52221+00	80	30	f	5
2147	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:03.192294+00	81	30	f	5
2148	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:03.882635+00	82	30	f	5
2149	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:04.562242+00	83	30	f	5
2150	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:05.232221+00	84	30	f	5
2151	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:05.922511+00	85	30	f	5
2152	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:06.58241+00	86	30	f	5
2153	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:07.262228+00	87	30	f	5
2154	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:07.922642+00	88	30	f	5
2155	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:08.652545+00	89	30	f	5
2156	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:09.312491+00	90	30	f	5
2157	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:09.982415+00	91	30	f	5
2158	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:10.662524+00	92	30	f	5
2159	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:11.326018+00	93	30	f	5
2160	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:11.98222+00	94	30	f	5
2161	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:12.652323+00	95	30	f	5
2162	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:13.332621+00	19	30	f	5
2163	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:14.002465+00	96	30	f	5
2164	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:14.682149+00	68	30	f	5
2165	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:15.342522+00	69	30	f	5
2166	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:16.002154+00	70	30	f	5
2167	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:16.672429+00	71	30	f	5
2168	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:17.352318+00	72	30	f	5
2169	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:18.03263+00	73	30	f	5
2170	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:18.682181+00	74	30	f	5
2171	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:19.352203+00	75	30	f	5
2172	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:20.022863+00	76	30	f	5
2173	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:20.6822+00	77	30	f	5
2174	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:21.362452+00	97	30	f	5
2175	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:22.012287+00	98	30	f	5
2176	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:22.682968+00	99	30	f	5
2177	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:23.332238+00	100	30	f	5
2178	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:24.041589+00	101	30	f	5
2179	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:24.692657+00	102	30	f	5
2180	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:25.35231+00	103	30	f	5
2181	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:26.011578+00	104	30	f	5
2182	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:26.661394+00	105	30	f	5
2183	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:27.312866+00	106	30	f	5
2184	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:27.962446+00	109	30	f	5
2185	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:28.621664+00	110	30	f	5
1663	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-05-01 22:12:55.823866+00	18	40	t	5
1706	test push noti	2025-05-01 22:14:54.928525+00	18	40	t	5
1749	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-05-01 22:18:29.000725+00	18	40	t	5
1891	tessssssssssssssssssss	2025-05-02 00:25:54.805522+00	18	40	t	5
1977	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-02 00:37:00.834509+00	18	40	t	5
2063	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-05-02 01:26:22.407939+00	18	40	t	5
2112	New lab "Lab1.pdf" has been uploaded.	2025-05-02 04:51:43.4293+00	18	31	t	5
2136	A new exam "Exam 66" has been scheduled for you at 5/2/2025, 11:18:00 AM.	2025-05-02 05:17:30.196246+00	18	31	t	\N
2139	A new exam "Exam 65" has been scheduled for you at 5/2/2025, 5:05:00 PM.	2025-05-02 11:04:20.198594+00	18	30	t	\N
2186	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-05-03 00:10:29.242996+00	18	30	t	5
2187	A new exam "Exam 50" has been scheduled for you at 5/3/2025, 5:04:00 AM.	2025-05-02 23:03:38.613283+00	18	27	t	\N
2188	A new exam "Exam 66" has been scheduled for you at 5/3/2025, 5:06:00 AM.	2025-05-02 23:05:38.686682+00	18	27	t	\N
2189	A new exam "Exam 50" has been scheduled for you at 5/3/2025, 5:14:00 AM.	2025-05-02 23:13:18.654341+00	18	27	t	\N
2190	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:45.83534+00	78	27	f	5
2191	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.042343+00	79	27	f	5
2192	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.156786+00	80	27	f	5
2193	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.259484+00	81	27	f	5
2194	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.359925+00	82	27	f	5
2195	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.463339+00	83	27	f	5
2196	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.576741+00	84	27	f	5
2197	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.68539+00	85	27	f	5
2198	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.785677+00	86	27	f	5
2199	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:46.891581+00	87	27	f	5
2200	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:47.007714+00	88	27	f	5
2201	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:47.126731+00	89	27	f	5
2202	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:47.239088+00	90	27	f	5
2203	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:47.352575+00	91	27	f	5
2204	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:47.516574+00	92	27	f	5
2205	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:47.818243+00	93	27	f	5
2206	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:48.125519+00	94	27	f	5
2207	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:48.43247+00	95	27	f	5
2208	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:48.739833+00	19	27	f	5
2209	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:49.047188+00	96	27	f	5
2210	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:49.354362+00	68	27	f	5
2211	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:49.455552+00	69	27	f	5
2212	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:49.562125+00	70	27	f	5
2213	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:49.670631+00	71	27	f	5
2214	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:49.786325+00	72	27	f	5
2215	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:49.888047+00	73	27	f	5
2216	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:49.991123+00	74	27	f	5
2217	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.097158+00	75	27	f	5
2218	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.198439+00	76	27	f	5
2219	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.31178+00	77	27	f	5
2220	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.422469+00	97	27	f	5
2221	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.537806+00	98	27	f	5
2222	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.651118+00	99	27	f	5
2223	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.762179+00	100	27	f	5
2224	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.866977+00	101	27	f	5
2225	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:50.987879+00	102	27	f	5
2226	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:51.102238+00	103	27	f	5
2227	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:51.221995+00	104	27	f	5
2228	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:51.333918+00	105	27	f	5
2229	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:51.461953+00	106	27	f	5
2230	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:51.582196+00	109	27	f	5
2231	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:51.698336+00	110	27	f	5
2232	New lab "django task-2.pdf" has been uploaded.	2025-05-02 23:21:51.811493+00	18	27	f	5
2233	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:39.883019+00	78	31	f	5
2234	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:40.621403+00	79	31	f	5
2235	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:41.207952+00	80	31	f	5
2236	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:42.332346+00	81	31	f	5
2237	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:42.924156+00	82	31	f	5
2238	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:43.517243+00	83	31	f	5
2239	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:44.107658+00	84	31	f	5
2240	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:44.690827+00	85	31	f	5
2241	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:45.613346+00	86	31	f	5
2242	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:46.727924+00	87	31	f	5
2243	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:47.572173+00	88	31	f	5
2244	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:48.182557+00	89	31	f	5
2245	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:48.770002+00	90	31	f	5
2246	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:49.354127+00	91	31	f	5
2247	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:49.94089+00	92	31	f	5
2248	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:50.528821+00	93	31	f	5
2249	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:51.114937+00	94	31	f	5
2250	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:51.696484+00	95	31	f	5
2251	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:52.278144+00	19	31	f	5
2252	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:52.869319+00	96	31	f	5
2253	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:53.461466+00	68	31	f	5
2254	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:54.053268+00	69	31	f	5
2255	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:54.640152+00	70	31	f	5
2256	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:55.225286+00	71	31	f	5
2257	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:55.811142+00	72	31	f	5
2258	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:56.759597+00	73	31	f	5
2259	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:57.34512+00	74	31	f	5
2260	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:57.92675+00	75	31	f	5
2261	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:58.512637+00	76	31	f	5
2262	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:59.096803+00	77	31	f	5
2263	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:50:59.696606+00	97	31	f	5
2264	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:00.281808+00	98	31	f	5
2265	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:01.134683+00	99	31	f	5
2266	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:01.71623+00	100	31	f	5
2267	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:02.30231+00	101	31	f	5
2268	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:02.912123+00	102	31	f	5
2269	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:03.506613+00	103	31	f	5
2270	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:04.090237+00	104	31	f	5
2271	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:04.674973+00	105	31	f	5
2272	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:05.258137+00	106	31	f	5
2273	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:05.846492+00	109	31	f	5
2274	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:06.439399+00	110	31	f	5
2275	New lab "قضية-1.pdf" has been uploaded.	2025-05-03 07:51:07.024654+00	18	31	f	5
2276	حسابكم عسير	2025-05-03 07:53:01.215043+00	78	31	f	5
2277	حسابكم عسير	2025-05-03 07:53:01.97065+00	79	31	f	5
2278	حسابكم عسير	2025-05-03 07:53:02.600753+00	80	31	f	5
2279	حسابكم عسير	2025-05-03 07:53:03.237294+00	81	31	f	5
2280	حسابكم عسير	2025-05-03 07:53:03.870995+00	82	31	f	5
2281	حسابكم عسير	2025-05-03 07:53:04.561289+00	83	31	f	5
2282	حسابكم عسير	2025-05-03 07:53:05.478421+00	84	31	f	5
2283	حسابكم عسير	2025-05-03 07:53:06.122248+00	85	31	f	5
2284	حسابكم عسير	2025-05-03 07:53:06.760441+00	86	31	f	5
2285	حسابكم عسير	2025-05-03 07:53:07.397833+00	87	31	f	5
2286	حسابكم عسير	2025-05-03 07:53:08.031604+00	88	31	f	5
2287	حسابكم عسير	2025-05-03 07:53:09.195144+00	89	31	f	5
2288	حسابكم عسير	2025-05-03 07:53:09.828237+00	90	31	f	5
2289	حسابكم عسير	2025-05-03 07:53:10.463578+00	91	31	f	5
2290	حسابكم عسير	2025-05-03 07:53:11.143928+00	92	31	f	5
2291	حسابكم عسير	2025-05-03 07:53:12.047138+00	93	31	f	5
2292	حسابكم عسير	2025-05-03 07:53:12.962197+00	94	31	f	5
2293	حسابكم عسير	2025-05-03 07:53:13.599369+00	95	31	f	5
2294	حسابكم عسير	2025-05-03 07:53:14.238404+00	19	31	f	5
2295	حسابكم عسير	2025-05-03 07:53:14.889057+00	96	31	f	5
2296	حسابكم عسير	2025-05-03 07:53:15.541419+00	68	31	f	5
2297	حسابكم عسير	2025-05-03 07:53:16.180853+00	69	31	f	5
2298	حسابكم عسير	2025-05-03 07:53:16.819174+00	70	31	f	5
2299	حسابكم عسير	2025-05-03 07:53:17.453605+00	71	31	f	5
2300	حسابكم عسير	2025-05-03 07:53:18.087861+00	72	31	f	5
2301	حسابكم عسير	2025-05-03 07:53:18.725457+00	73	31	f	5
2302	حسابكم عسير	2025-05-03 07:53:19.361278+00	74	31	f	5
2303	حسابكم عسير	2025-05-03 07:53:20.009777+00	75	31	f	5
2304	حسابكم عسير	2025-05-03 07:53:20.666131+00	76	31	f	5
2305	حسابكم عسير	2025-05-03 07:53:21.302441+00	77	31	f	5
2306	حسابكم عسير	2025-05-03 07:53:21.939187+00	97	31	f	5
2307	حسابكم عسير	2025-05-03 07:53:22.583124+00	98	31	f	5
2308	حسابكم عسير	2025-05-03 07:53:23.214837+00	99	31	f	5
2309	حسابكم عسير	2025-05-03 07:53:23.850177+00	100	31	f	5
2310	حسابكم عسير	2025-05-03 07:53:24.498242+00	101	31	f	5
2311	حسابكم عسير	2025-05-03 07:53:25.130243+00	102	31	f	5
2312	حسابكم عسير	2025-05-03 07:53:25.764027+00	103	31	f	5
2313	حسابكم عسير	2025-05-03 07:53:26.399819+00	104	31	f	5
2314	حسابكم عسير	2025-05-03 07:53:27.300884+00	105	31	f	5
2315	حسابكم عسير	2025-05-03 07:53:27.940785+00	106	31	f	5
2316	حسابكم عسير	2025-05-03 07:53:28.592271+00	109	31	f	5
2317	حسابكم عسير	2025-05-03 07:53:29.22413+00	110	31	f	5
2318	حسابكم عسير	2025-05-03 07:53:29.86347+00	18	31	f	5
2319	A new exam "Exam 65" has been scheduled for you at 5/3/2025, 3:53:00 PM.	2025-05-03 09:52:56.473871+00	18	30	f	\N
2320	A new exam "Exam 66" has been scheduled for you at 5/3/2025, 3:58:00 PM.	2025-05-03 09:57:42.797707+00	18	30	f	\N
2321	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:24.997885+00	78	30	f	5
2322	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:26.058809+00	79	30	f	5
2323	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:26.934561+00	80	30	f	5
2324	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:27.824897+00	81	30	f	5
2325	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:28.603047+00	82	30	f	5
2326	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:29.396064+00	83	30	f	5
2327	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:30.194405+00	84	30	f	5
2328	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:31.068969+00	85	30	f	5
2329	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:31.842809+00	86	30	f	5
2330	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:32.616873+00	87	30	f	5
2331	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:33.340463+00	88	30	f	5
2332	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:34.220301+00	89	30	f	5
2333	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:34.991151+00	90	30	f	5
2334	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:35.895413+00	91	30	f	5
2335	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:36.864877+00	92	30	f	5
2336	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:37.575674+00	93	30	f	5
2337	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:38.410426+00	94	30	f	5
2338	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:39.314746+00	95	30	f	5
2339	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:40.178338+00	19	30	f	5
2340	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:40.95782+00	96	30	f	5
2341	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:41.7659+00	68	30	f	5
2342	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:42.643947+00	69	30	f	5
2343	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:43.730878+00	70	30	f	5
2344	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:44.61354+00	71	30	f	5
2345	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:45.480224+00	72	30	f	5
2346	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:46.2824+00	73	30	f	5
2347	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:47.15388+00	74	30	f	5
2348	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:48.034001+00	75	30	f	5
2349	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:49.09249+00	76	30	f	5
2350	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:49.876656+00	77	30	f	5
2351	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:50.596473+00	97	30	f	5
2352	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:51.407886+00	98	30	f	5
2353	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:52.302506+00	99	30	f	5
2354	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:53.071912+00	100	30	f	5
2355	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:53.962719+00	101	30	f	5
2356	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:54.775812+00	102	30	f	5
2357	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:55.734459+00	103	30	f	5
2358	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:56.614552+00	104	30	f	5
2359	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:57.499591+00	105	30	f	5
2360	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:58.369055+00	106	30	f	5
2361	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:59.246196+00	109	30	f	5
2362	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:11:59.958541+00	110	30	f	5
2363	New lab "Recovery Key.pdf" has been uploaded.	2025-05-03 10:12:00.938881+00	18	30	f	5
2364	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:06.430102+00	78	30	f	5
2365	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:07.469317+00	79	30	f	5
2366	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:08.170152+00	80	30	f	5
2367	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:08.951813+00	81	30	f	5
2368	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:09.73256+00	82	30	f	5
2369	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:10.610822+00	83	30	f	5
2370	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:11.31178+00	84	30	f	5
2371	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:12.077999+00	85	30	f	5
2372	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:12.881493+00	86	30	f	5
2373	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:13.635953+00	87	30	f	5
2374	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:14.344347+00	88	30	f	5
2375	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:15.122687+00	89	30	f	5
2376	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:15.926811+00	90	30	f	5
2377	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:16.711466+00	91	30	f	5
2378	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:17.496394+00	92	30	f	5
2379	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:18.280938+00	93	30	f	5
2380	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:19.072219+00	94	30	f	5
2381	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:19.853706+00	95	30	f	5
2382	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:20.712862+00	19	30	f	5
2383	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:21.409679+00	96	30	f	5
2384	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:22.246119+00	68	30	f	5
2385	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:23.024879+00	69	30	f	5
2386	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:23.897091+00	70	30	f	5
2387	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:24.978879+00	71	30	f	5
2388	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:25.69009+00	72	30	f	5
2389	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:26.374925+00	73	30	f	5
2390	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:27.16589+00	74	30	f	5
2391	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:28.031224+00	75	30	f	5
2392	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:28.822404+00	76	30	f	5
2393	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:29.811535+00	77	30	f	5
2394	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:30.706963+00	97	30	f	5
2395	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:31.574444+00	98	30	f	5
2396	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:32.469215+00	99	30	f	5
2397	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:33.248612+00	100	30	f	5
2398	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:34.030991+00	101	30	f	5
2399	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:34.832127+00	102	30	f	5
2400	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:35.601457+00	103	30	f	5
2401	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:36.600881+00	104	30	f	5
2402	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:37.464804+00	105	30	f	5
2403	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:38.337924+00	106	30	f	5
2404	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:39.321146+00	109	30	f	5
2405	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:40.292162+00	110	30	f	5
2406	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-05-03 10:15:40.986466+00	18	30	f	5
2407	A new exam "Exam 66" has been scheduled for you at 5/7/2025, 1:04:00 AM.	2025-05-06 19:02:51.773082+00	18	30	f	\N
2408	A new exam "Exam 65" has been scheduled for you at 5/7/2025, 1:11:00 AM.	2025-05-06 19:10:45.894829+00	18	30	f	\N
\.


--
-- Data for Name: st_notifications_predefinednotification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.st_notifications_predefinednotification (id, message, created_at) FROM stdin;
3	Hello, your results have been updated in the system based on your recent tasks solved on GitHub/LeetCode. Make sure to track your progress for the upcoming exams.	2025-04-21 22:29:37.435218+00
4	You're about to complete your exam in the system! Ensure you've completed all required tasks and submitted your solutions correctly. Good luck!	2025-04-21 22:30:12.460831+00
5	Congratulations! You've successfully solved [number] problems on GitHub/LeetCode. This will enhance your performance in the upcoming exam. Keep up the great work!	2025-04-21 22:30:29.07186+00
6	Congratulations! You performed great in the last exam, but don’t stop here! Keep improving your skills by solving more challenges on GitHub/LeetCode.	2025-04-21 22:30:43.174389+00
7	We know that some problems can be tough, but remember, every step you take brings you closer to success. Keep working hard, and you will achieve great results!	2025-04-21 22:31:07.142738+00
8	Your progress in solving problems on GitHub/LeetCode has been tracked. Ensure that you're meeting the required performance levels to be fully prepared for the upcoming exams.	2025-04-21 22:31:40.982508+00
9	new test from fofa	2025-04-21 23:21:02.154074+00
10	mina insturactor testt	2025-04-22 00:13:57.251831+00
11	Alhamd lel lah rabb el 3alameen	2025-04-22 00:36:33.069521+00
12	Alhamd lel lah rabb el 3alameen tani	2025-04-22 00:40:14.216115+00
13	Alhamd lel lah rabb el 3alameen third time	2025-04-22 02:17:29.343074+00
14	new test	2025-04-23 23:44:48.747384+00
15	test test test add new	2025-04-24 00:15:32.851151+00
16	testt	2025-04-24 22:22:26.638776+00
17	demo test	2025-04-28 00:37:51.233973+00
18	tessssssssssssssssssss	2025-05-01 22:19:00.595688+00
19	حسابكم عسير	2025-05-03 07:52:37.01455+00
\.


--
-- Data for Name: st_notifications_pushsubscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.st_notifications_pushsubscription (id, subscription, created_at, user_id) FROM stdin;
18	{"keys": {"auth": "z2fbV9evOBsU6xl0JsZ6jw", "p256dh": "BAGKG_t-9eNYglwiHPxAX0YipQ5VHwZwcWwlhhNf6GMTlK55UvU0D80XSi0MVrHkUhVJHcWvAiOGySiXWiAPQcs"}, "endpoint": "https://wns2-par02p.notify.windows.com/w/?token=BQYAAABb3fSzLsoOogDTiNosg8KeFGhW%2bx2tLmFfn2mWUy4PxNIp4E1oEliqA%2fmZiMycW9HGSlG3WEeKF2yJWuizkDWNsEDis8jlmKFBf9lMMAHTrpoaTKZkhMhAPoh0ZkyCv%2fK9W3cpXynOQCxhdIaOuVl43sEF2GFbfDlx9uTCrX83DvtF15mfLKscC3eeFHmybKqoykmJr95aeW1bPxVNN5YDGpoee9%2fq%2fQtZiS1g57upzMZXnM6lB7wkmZaSJMeQJQIbS6wHyKAT1OKZkfbmpNaf5oz0lNw%2bumKpu9qEs6%2b8gp%2flGaCBWncc0dvpxz3COho%3d", "expirationTime": null}	2025-05-02 00:19:30.07816+00	33
\.


--
-- Data for Name: users_track_instructors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_track_instructors (id, track_id, instructor_id) FROM stdin;
1	2	23
2	7	24
3	7	25
5	7	5
6	7	16
4	8	5
8	5	27
10	5	28
12	5	29
14	5	30
16	5	31
18	5	32
20	5	33
22	5	34
24	5	40
\.


--
-- Data for Name: users_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: users_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Name: api_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_task_id_seq', 1, true);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 140, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 36, true);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 35, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 63, true);


--
-- Name: exams_cheatinglog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_cheatinglog_id_seq', 3725, true);


--
-- Name: exams_codingquestion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_codingquestion_id_seq', 26, true);


--
-- Name: exams_codingtestcase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_codingtestcase_id_seq', 32, true);


--
-- Name: exams_exam_CodingQuestions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."exams_exam_CodingQuestions_id_seq"', 91, true);


--
-- Name: exams_exam_MCQQuestions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."exams_exam_MCQQuestions_id_seq"', 97, true);


--
-- Name: exams_exam_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_exam_id_seq', 66, true);


--
-- Name: exams_mcqquestion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_mcqquestion_id_seq', 18, true);


--
-- Name: exams_studentexamanswer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_studentexamanswer_id_seq', 77, true);


--
-- Name: exams_temporaryexaminstance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_temporaryexaminstance_id_seq', 181, true);


--
-- Name: exams_temporaryexaminstance_students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_temporaryexaminstance_students_id_seq', 276, true);


--
-- Name: labs_lab_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.labs_lab_id_seq', 48, true);


--
-- Name: social_auth_association_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_auth_association_id_seq', 1, false);


--
-- Name: social_auth_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_auth_code_id_seq', 1, false);


--
-- Name: social_auth_nonce_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_auth_nonce_id_seq', 1, false);


--
-- Name: social_auth_partial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_auth_partial_id_seq', 1, false);


--
-- Name: social_auth_usersocialauth_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_auth_usersocialauth_id_seq', 1, false);


--
-- Name: st_notifications_note_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.st_notifications_note_id_seq', 2408, true);


--
-- Name: st_notifications_predefinednotification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.st_notifications_predefinednotification_id_seq', 19, true);


--
-- Name: st_notifications_pushsubscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.st_notifications_pushsubscription_id_seq', 21, true);


--
-- Name: users_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_branch_id_seq', 22, true);


--
-- Name: users_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_course_id_seq', 42, true);


--
-- Name: users_instructor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_instructor_id_seq', 40, true);


--
-- Name: users_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_student_id_seq', 110, true);


--
-- Name: users_track_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_track_id_seq', 8, true);


--
-- Name: users_track_instructors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_track_instructors_id_seq', 24, true);


--
-- Name: users_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_groups_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 166, true);


--
-- Name: users_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_user_permissions_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

