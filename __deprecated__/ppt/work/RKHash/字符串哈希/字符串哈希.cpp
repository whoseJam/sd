#include<bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const ull base=13131;
const int N=10005;
char s[N];
int n;

ull Hash(char* s){
	ull ans=0;
	int l=strlen(s+1);
	for(int i=1;i<=l;i++)
		ans=ans*base+s[i];
	return ans;
}

int main(){
	n=read();
	set<ull>S;
	for(int i=1;i<=n;i++){
		scanf("%s",s+1);
		ull code=Hash(s);
		S.insert(code);
	}
//	set<string>S;
//	for(int i=1;i<=n;i++){
//		string tmp;
//		cin>>tmp;
//		S.insert(tmp);
//	}
	cout<<S.size()<<'\n';
	return 0;
}
