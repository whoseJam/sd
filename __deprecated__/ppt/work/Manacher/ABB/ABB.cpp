#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;

const int N=1000005;
char a[N];
int p[N],n;

void Manacher(const string& s){
	int Max=0,pos=0;
	for(int i=1;i<s.length();i++){
		if(Max>i)p[i]=min(p[pos*2-i],Max-i);
		else p[i]=1;
		while(s[i+p[i]]==s[i-p[i]])p[i]++;
		if(Max<i+p[i]){
			Max=i+p[i];
			pos=i;
		}
	}
}

int main(){
	scanf("%d%s",&n,a+1);
	
	string s;
	s+='{';
	for(int i=1;i<=n;i++){
		s+='#';
		s+=a[i];
	}
	s+='#';
	s+='}';
	Manacher(s);
		
	int ans=n;
	for(int i=2;i<=s.length()-2;i++){
		if(i+p[i]==s.length()-1){
			ans=min(ans,(i-p[i])/2);
		}
	}
	cout<<ans;
	return 0;
}

