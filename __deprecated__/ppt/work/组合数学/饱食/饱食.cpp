#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef long long ll;
ll cntM,cntC,cntO,cntI;
int n; 

int main(){
	cin>>n;
	for(int i=1;i<=n;i++){
		string s;
		cin>>s;
		if(s[0]=='M')cntM++;
		if(s[0]=='C')cntC++;
		if(s[0]=='O')cntO++;
		if(s[0]=='I')cntI++;
	}
	ll ans=
		(cntM*cntC*cntO)+
		(cntM*cntC*cntI)+
		(cntM*cntO*cntI)+
		(cntC*cntO*cntI);
	cout<<ans;
	return 0;
}

